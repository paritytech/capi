import { Deferred, deferred } from "../deps/std/async.ts"
import { abortIfAny } from "../util/abort.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"

export class Period {
  min = 0
  max = Infinity

  hasMax = deferred()

  children: Period[] = []

  restrictMin(min: number) {
    if (min > this.min) {
      this.min = min
      for (const child of this.children) {
        child.restrictMin(min)
      }
    }
  }

  restrictMax(max: number) {
    if (max < this.max) {
      this.max = max
      this.hasMax.resolve()
      for (const child of this.children) {
        child.restrictMax(max)
      }
    }
  }

  restrictTo(period: Period) {
    this.restrictMin(period.min)
    this.restrictMax(period.max)
    period.children.push(this)
  }
}

export class Cast {
  time = 0

  nextTick = deferred()

  constructor() {
    // @ts-ignore .
    this.noActive.state = "fulfilled"
  }

  tick() {
    this.nextTick.resolve()
    this.nextTick = deferred()
    return ++this.time
  }

  addActive() {
    if (this.noActive.state === "fulfilled") {
      this.noActive = deferred()
    }
    this.active++
  }

  noActive = Promise.resolve() as Deferred<unknown>
  removeActive() {
    if (!--this.active) {
      this.noActive.resolve()
    }
  }

  active = 0

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

  abstract evaluate(time: number, applicable: Period, signal: AbortSignal): Promise<T | E>

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
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    const result = await primed.evaluate(0, new Period(), new AbortController().signal)
    abortController.abort()
    return result
  }

  async *watch(): AsyncIterable<T | E> {
    const abortController = new AbortController()
    const cast = new Cast()
    const primed = cast.prime(this, abortController.signal)
    let period = new Period()
    while (true) {
      yield await primed.evaluate(period.min, period, new AbortController().signal)
      await Promise.race([
        cast.noActive,
        period.hasMax,
      ])
      if (period.max === Infinity) break
      const start = period.max + 1
      period = new Period()
      period.restrictMin(start)
    }
    abortController.abort()
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
    time: number,
    applicable: Period,
    signal: AbortSignal,
  ): Promise<E | Exclude<R, Error> | Extract<R, Error>> {
    const value = (await this.base.evaluate(time, applicable, signal)) as T | E
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

  async evaluate(time: number, applicable: Period, signal: AbortSignal) {
    const failedResult = deferred()
    const childController = abortIfAny(signal)
    return Promise.race([
      failedResult,
      Promise.all(
        this.children.map((child) =>
          child.evaluate(time, applicable, childController.signal).then(
            (value) => {
              if (!(value instanceof Error)) return value
              if (!childController.signal.aborted) {
                failedResult.resolve(value)
                childController.abort()
              }
              return Promise.reject(null)
            },
          )
        ),
      ),
    ])
  }
}

class _StreamRune<T, E extends Error> extends _Rune<T, E> {
  initProm = deferred<void>()
  values: (T | E | undefined)[] = []
  lastPeriod = new Period()
  constructor(cast: Cast, fn: (signal?: AbortSignal) => AsyncIterable<T | E>) {
    super(cast)
    cast.addActive()
    ;(async () => {
      const iter = fn(this.signal)
      let first = true
      for await (const value of iter) {
        if (first) {
          first = false
          this.values[0] = value
          this.initProm.resolve()
        } else {
          this.lastPeriod.restrictMax(this.cast.time)
          this.values[++this.cast.time] = value
          this.lastPeriod = new Period()
          this.lastPeriod.restrictMin(this.cast.time)
        }
      }
      cast.removeActive()
    })()
  }

  async evaluate(time: number, applicable: Period): Promise<T | E> {
    await this.initProm
    let end = Infinity
    const idx = this.values.findLastIndex((_, i) => {
      if (i <= time) return true
      end = i
      return false
    })
    if (end === Infinity) {
      applicable.restrictTo(this.lastPeriod)
    } else {
      applicable.restrictMin(idx)
      applicable.restrictMax(end)
    }
    return this.values[idx]!
  }
}
