import { deferred } from "../deps/std/async.ts"
import { abortIfAny } from "../util/abort.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { Id } from "./id.ts"
import { Loom, Warp } from "./loom.ts"

export class Cast {
  loom = new Loom()

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

  private constructor(readonly id: Id, readonly _prime: (cast: Cast) => _Rune<T, E>) {}

  static new<T, E extends Error, A extends unknown[]>(
    ctor: new(cast: Cast, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune(Id.hash(Id.loc``, ctor, ...args), (cast) => new ctor(cast, ...args))
  }

  async run(): Promise<T | E> {
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    const result = await primed.evaluate(new Warp(), new Warp(), new AbortController().signal)
    abortController.abort()
    return result
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _E<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<R>(
    id: Id,
    fn: (value: T) => PromiseOr<R>,
  ): Rune<Exclude<R, Error>, E | Extract<R, Error>> {
    return Rune.new(_PipeRune, this, id, fn)
  }

  static ls<F extends unknown[]>(runes: [...F]): Rune<
    { [K in keyof F]: _T<F[K]> },
    _E<F[number]>
  > {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
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
    _id: Id,
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
