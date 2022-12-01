import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"

class Notification implements PromiseLike<void> {
  private _next: Deferred<void> = null!
  // dprint-ignore (doesn't respect instantiation expression)
  then<T1 = void, T2 = never>(...args: Parameters<typeof this._next.then<T1, T2>>) {
    return (this._next ??= deferred()).then(...args)
  }
  emit() {
    this._next?.resolve()
    this._next = null!
  }
}

export class Period {
  min = 0
  max = Infinity

  minChange = new Notification()
  maxChange = new Notification()

  children: Period[] = []

  restrictMin(min: number) {
    if (min <= this.min) return
    this.min = min
    this.minChange.emit()
    for (const child of this.children) {
      child.restrictMin(min)
    }
  }

  restrictMax(max: number) {
    if (max >= this.max) return
    this.max = max
    this.maxChange.emit()
    for (const child of this.children) {
      child.restrictMax(max)
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
  tick() {
    return ++this.time
  }

  active = 0
  noActive = new Notification()

  addActive() {
    this.active++
  }

  removeActive() {
    if (!--this.active) {
      this.noActive.emit()
    }
  }

  primed = new Map<Rune<any, any>, _Rune<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): _Rune<T, E> {
    const primed = getOrInit(this.primed, rune, () => rune._prime(this))
    primed.reference(signal)
    return primed
  }
}

export type _T<R> = R extends Rune<infer T, any> ? T : R
export type _U<R> = R extends Rune<any, infer U> ? U : never

export abstract class _Rune<T, U> {
  declare "": [T, U]

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

  abstract evaluate(time: number, applicable: Period, signal: AbortSignal): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

export class Rune<T, U = never> {
  declare "": [T, U]

  private constructor(readonly _prime: (cast: Cast) => _Rune<T, U>) {}

  static new<T, E, A extends unknown[]>(
    ctor: new(cast: Cast, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((cast) => new ctor(cast, ...args))
  }

  async run(): Promise<T | U> {
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    const result = await primed.evaluate(0, new Period(), new AbortController().signal)
    abortController.abort()
    return result
  }

  async *watch(): AsyncIterable<T | U> {
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    let period = new Period()
    while (true) {
      yield await primed.evaluate(period.min, period, new AbortController().signal)
      if (period.max === Infinity) {
        if (!cast.active) return
        await Promise.race([
          cast.noActive,
          period.maxChange,
        ])
        if (period.max === Infinity) break
      }
      const start = period.max + 1
      period = new Period()
      period.restrictMin(start)
    }
    abortController.abort()
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _U<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<T2>(
    fn: (value: T) => PromiseOr<T2>,
  ): Rune<T2, U> {
    return Rune.new(_PipeRune, this, fn)
  }

  static ls<R extends unknown[]>(runes: [...R]): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[number]>>
  static ls<R extends unknown[]>(runes: [...R]): Rune<_T<R[number]>[], _U<R[number]>> {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
  }

  static stream<T>(fn: () => AsyncIterable<T>) {
    return Rune.new(_StreamRune, fn)
  }

  unwrap<T2 extends T>(fn: (value: T) => value is T2): Rune<T2, U | Exclude<T, T2>> {
    return Rune.new(_UnwrapRune, this, fn)
  }

  unwrapNot<T2 extends T>(fn: (value: T) => value is T2): Rune<Exclude<T, T2>, U | T2>
  unwrapNot<T2 extends T>(
    fn: (value: T) => value is T2,
  ): Rune<Exclude<T, T2>, U | Exclude<T, Exclude<T, T2>>> {
    return this.unwrap((value): value is Exclude<T, T2> => !fn(value))
  }

  unwrapError() {
    return this.unwrapNot((x): x is T & Error => x instanceof Error)
  }

  unwrapOption() {
    return this.unwrapNot((x): x is T & undefined => x === undefined)
  }

  catch() {
    return Rune.new(_CatchRune, this)
  }
}

class _ConstantRune<T> extends _Rune<T, never> {
  constructor(cast: Cast, readonly value: T) {
    super(cast)
  }

  async evaluate() {
    return this.value
  }
}

class _PipeRune<T1, U, T2> extends _Rune<T2, U> {
  child
  constructor(cast: Cast, child: Rune<T1, U>, readonly fn: (value: T1) => PromiseOr<T2>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async evaluate(time: number, applicable: Period, signal: AbortSignal) {
    return await this.fn(await this.child.evaluate(time, applicable, signal))
  }
}

class _LsRune<T, U> extends _Rune<T[], U> {
  children
  constructor(cast: Cast, children: Rune<T, U>[]) {
    super(cast)
    this.children = children.map((child) => cast.prime(child, this.signal))
  }

  async evaluate(time: number, applicable: Period, signal: AbortSignal) {
    return Promise.all(this.children.map((child) => child.evaluate(time, applicable, signal)))
  }
}

class _StreamRune<T> extends _Rune<T, never> {
  initProm = deferred<void>()
  values: (T | undefined)[] = []
  lastPeriod = new Period()
  constructor(cast: Cast, fn: (signal?: AbortSignal) => AsyncIterable<T>) {
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

  async evaluate(time: number, applicable: Period): Promise<T> {
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

export class UnwrappedValue {
  constructor(readonly value: unknown) {}
}

class _UnwrapRune<T1, U, T2 extends T1> extends _Rune<T2, U | Exclude<T1, T2>> {
  child
  constructor(cast: Cast, child: Rune<T1, U>, readonly fn: (value: T1) => value is T2) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async evaluate(time: number, applicable: Period, signal: AbortSignal) {
    const value = await this.child.evaluate(time, applicable, signal)
    if (this.fn(value)) return value
    throw new UnwrappedValue(value)
  }
}

class _CatchRune<T, U> extends _Rune<T | U, never> {
  child
  constructor(cast: Cast, child: Rune<T, U>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async evaluate(time: number, applicable: Period, signal: AbortSignal) {
    try {
      return await this.child.evaluate(time, applicable, signal)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        return e.value as U
      }
      throw e
    }
  }
}
