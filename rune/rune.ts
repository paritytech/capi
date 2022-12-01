import { deferred } from "../deps/std/async.ts"
import { abortIfAny } from "../util/abort.ts"
import { cbToAsyncIter } from "../util/cbToAsyncIter.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { Loom, Warp, Weft } from "./loom.ts"

export class Cast {
  constructor(readonly loom: Loom) {}

  primed = new Map<Rune<any, any>, _Rune<any, any>>()
  prime<T, E extends Error>(rune: Rune<T, E>, signal: AbortSignal): _Rune<T, E> {
    const primed = getOrInit(this.primed, rune, () => rune._prime(this))
    primed.reference(signal)
    return primed
  }
}

export type _T<F> = F extends Rune<infer T, any> ? T : Exclude<F, Error>
export type _E<F> = F extends Rune<any, infer E> ? E : Extract<F, Error>

export abstract class _Rune<T, E extends Error> {
  declare "": [T, E]

  abortController = new AbortController()
  signal = this.abortController.signal
  constructor(readonly cast: Cast) {
    this.signal.addEventListener("abort", () => this.cleanup())
  }

  referenceCount = 0
  reference(signal: AbortSignal) {
    this.referenceCount++
    signal.addEventListener("abort", () => {
      if (!--this.referenceCount) {
        this.abortController.abort()
      }
    })
  }

  abstract evaluate(reference: Warp, used: Warp, signal: AbortSignal): Promise<T | E>

  alive = true
  cleanup() {
    this.alive = false
  }
}

export class Rune<T, E extends Error> {
  declare "": [T, E]

  private constructor(readonly _prime: (cast: Cast) => _Rune<T, E>) {}

  static new<T, E extends Error, A extends unknown[]>(
    ctor: new(cast: Cast, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((cast) => new ctor(cast, ...args))
  }

  async run(): Promise<T | E> {
    const cast = new Cast(new Loom(() => {}, () => {}))
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    const warp = new Warp()
    const result = await primed.evaluate(warp, warp.fork(), new AbortController().signal)
    abortController.abort()
    return result
  }

  async *watch(): AsyncIterable<T | E> {
    const { cb, iter, signal, end } = cbToAsyncIter<[Weft, number]>()
    const loom = new Loom((...x) => cb(x), () => {
      if (!loom.activeWefts) end()
    })
    const cast = new Cast(loom)
    const primed = cast.prime(this, signal)
    const warp = new Warp()
    yield await primed.evaluate(warp, warp.fork(), new AbortController().signal)
    for await (const [weft, knot] of iter) {
      warp.tie(weft, knot, true)
      yield await primed.evaluate(warp, warp.fork(), new AbortController().signal)
    }
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _E<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<R>(
    fn: (value: T) => PromiseOr<R>,
  ): Rune<Exclude<R, Error>, E | Extract<R, Error>> {
    return Rune.new(_PipeRune, this, fn)
  }

  static ls<F extends unknown[]>(runes: [...F]): Rune<
    { [K in keyof F]: _T<F[K]> },
    _E<F[number]>
  > {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
  }

  static stream<R>(fn: () => AsyncIterable<R>) {
    return Rune.new(_StreamRune, fn)
  }
}

class _ConstantRune<T> extends _Rune<Exclude<T, Error>, Extract<T, Error>> {
  constructor(cast: Cast, readonly value: T) {
    super(cast)
  }

  async evaluate() {
    return this.value as Exclude<T, Error> | Extract<T, Error>
  }
}

class _PipeRune<T, E extends Error, R> extends _Rune<Exclude<R, Error>, E | Extract<R, Error>> {
  base
  constructor(
    cast: Cast,
    base: Rune<T, E>,
    readonly fn: (value: T) => PromiseOr<R>,
  ) {
    super(cast)
    this.base = cast.prime(base, this.signal)
  }

  async evaluate(
    reference: Warp,
    used: Warp,
    signal: AbortSignal,
  ): Promise<E | Exclude<R, Error> | Extract<R, Error>> {
    const value = (await this.base.evaluate(reference, used, signal)) as T | E
    if (value instanceof Error) return value
    return await this.fn(value) as
      | Exclude<R, Error>
      | Extract<R, Error>
  }
}

class _LsRune extends _Rune<any, any> {
  children
  constructor(cast: Cast, children: Rune<any, any>[]) {
    super(cast)
    this.children = children.map((child) => cast.prime(child, this.signal))
  }

  async evaluate(reference: Warp, used: Warp, signal: AbortSignal) {
    const failedResult = deferred()
    const childController = abortIfAny(signal)
    return Promise.race([
      failedResult,
      Promise.all(
        this.children.map((child) =>
          child.evaluate(reference, used.fork(), childController.signal).then((value) => {
            if (!(value instanceof Error)) return value
            if (!childController.signal.aborted) {
              failedResult.resolve(value)
              childController.abort()
            }
            return Promise.reject(null)
          })
        ),
      ),
    ])
  }
}

class _StreamRune<T, E extends Error> extends _Rune<T, E> {
  values: (T | E)[] = []
  initProm = deferred<void>()
  weft!: Weft
  constructor(cast: Cast, fn: (signal?: AbortSignal) => AsyncIterable<T | E>) {
    super(cast)
    this.weft = new Weft(cast.loom)
    ;(async () => {
      const iter = fn(this.signal)
      for await (const value of iter) {
        if (!this.values.length) {
          this.initProm.resolve()
          this.values[0] = value
        } else {
          this.values[this.weft.extend()] = value
        }
      }
      this.weft.cut()
    })()
  }

  async evaluate(reference: Warp, used: Warp): Promise<T | E> {
    await this.initProm
    const idx = used.tie(this.weft, reference.get(this.weft) ?? this.weft.lastKnot)
    return this.values[idx]!
  }
}
