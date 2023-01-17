import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { EventSource, Receipt, Timeline } from "./timeline.ts"

export class Batch {
  constructor(
    readonly timeline = new Timeline(),
    readonly parent?: Batch,
    readonly parentTime = 0,
    readonly parentReceipt = new Receipt(),
  ) {}

  primed = new Map<Rune<any, any>, _Rune<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): _Rune<T, E> {
    const primed = getOrInit(this.primed, rune, () => this.getPrimed(rune) ?? rune._prime(this))
    primed.reference(signal)
    return primed
  }

  getPrimed<T, E>(rune: Rune<T, E>): _Rune<T, E> | undefined {
    const existing = this.primed.get(rune)
    if (existing) return existing
    const parent = this.parent?.getPrimed(rune)
    if (parent) {
      const proxy = new _ProxyRune(this, parent)
      this.primed.set(rune, proxy)
      return proxy
    }
    return undefined
  }

  spawn(time: number, receipt: Receipt) {
    return new Batch(new Timeline(), this, time, receipt)
  }
}

export type _T<R> = R extends Rune<infer T, any> ? T : R
export type _U<R> = R extends Rune<any, infer U> ? U : never

export abstract class _Rune<T, U> {
  declare "": [T, U]

  abortController = new AbortController()
  signal = this.abortController.signal
  constructor(readonly batch: Batch) {
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

  _currentTime = -1
  _currentPromise: Promise<T> = null!
  _currentReceipt = new Receipt()
  async evaluate(time: number, receipt: Receipt) {
    if (this._currentTime > time) throw new Error("cannot regress")
    if (this._currentTime < time) {
      this._currentReceipt = new Receipt()
      if (this._currentTime === -1) {
        this._currentReceipt.novel = true
      }
      this._currentTime = time
      this._currentPromise = this._evaluate(time, this._currentReceipt)
    }
    const _receipt = this._currentReceipt
    const value = await this._currentPromise
    receipt.setFrom(_receipt)
    return value
  }
  abstract _evaluate(time: number, receipt: Receipt): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

class _ProxyRune<T, E> extends _Rune<T, E> {
  constructor(batch: Batch, readonly inner: _Rune<T, E>) {
    super(batch)
  }

  _evaluate(): Promise<T> {
    return this.inner.evaluate(this.batch.parentTime, this.batch.parentReceipt)
  }
}

export class Rune<T, U = never> {
  declare "": [T, U]

  constructor(readonly _prime: (batch: Batch) => _Rune<T, U>) {}

  static new<T, E, A extends unknown[]>(
    ctor: new(batch: Batch, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((batch) => new ctor(batch, ...args))
  }

  async run(batch = new Batch()): Promise<T> {
    for await (const value of this.watch(batch)) {
      return value
    }
    throw new Error("Rune did not yield any values")
  }

  async *watch(batch = new Batch()): AsyncIterable<T> {
    const abortController = new AbortController()
    const primed = batch.prime(this, abortController.signal)
    let time = 0
    try {
      while (time !== Infinity) {
        const receipt = new Receipt()
        const value = await primed.evaluate(time, receipt)
        if (receipt.novel) {
          yield value
        }
        await receipt.finalized()
        time = receipt.nextTime
      }
    } finally {
      abortController.abort()
    }
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _U<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<T2>(
    fn: (value: T, batch: Batch) => PromiseOr<T2>,
  ): Rune<T2, U> {
    return Rune.new(_PipeRune, this, fn)
  }

  static ls<R extends unknown[]>(runes: [...R]): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[number]>>
  static ls<R extends unknown[]>(runes: [...R]): Rune<_T<R[number]>[], _U<R[number]>> {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
  }

  static rec<R extends {}>(
    runes: R,
  ): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.ls(values).pipe((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v]))
    })
  }

  static stream<T>(fn: (signal: AbortSignal) => AsyncIterable<T>): Rune<T, never> {
    return Rune.new(_StreamRune, fn)
  }

  // TODO: improve typing of unwrap* methods

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
    return this.unwrapNot((x): x is Extract<T, Error> => x instanceof Error)
  }

  unwrapOption() {
    return this.unwrapNot((x): x is T & undefined => x === undefined)
  }

  catch(): Rune<
    T | Exclude<U, UnwrappedValue<any>>,
    U extends UnwrappedValue<infer X> ? X : never
  > {
    return Rune.new(_CatchRune, this)
  }

  wrapU() {
    return Rune.new(_WrapURune, this)
  }

  lazy() {
    return Rune.new(_LazyRune, this)
  }

  as<T2 extends T, U2 extends U = U>(): Rune<T2, U2> {
    return new Rune(this._prime as any)
  }

  subclass<A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => _Rune<T, U>, ...args: A) => C,
    ...args: A
  ) {
    return new ctor(this._prime, ...args)
  }
}

class _ConstantRune<T> extends _Rune<T, never> {
  constructor(batch: Batch, readonly value: T) {
    super(batch)
  }

  async _evaluate() {
    return this.value
  }
}

class _PipeRune<T1, U, T2> extends _Rune<T2, U> {
  child
  constructor(
    batch: Batch,
    child: Rune<T1, U>,
    readonly fn: (value: T1, batch: Batch) => PromiseOr<T2>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(
      source,
      this.fn.length === 1 ? null! : this.batch.spawn(time, receipt),
    )
  }
}

class _LsRune<T, U> extends _Rune<T[], U> {
  children
  constructor(batch: Batch, children: Rune<T, U>[]) {
    super(batch)
    this.children = children.map((child) => batch.prime(child, this.signal))
  }

  async _evaluate(time: number, receipt: Receipt) {
    return Promise.all(this.children.map((child) => child.evaluate(time, receipt)))
  }
}

export class _StreamRune<T> extends _Rune<T, never> {
  initPromise = deferred<void>()
  valueQueue: [number, T][] = []
  eventSource = new EventSource(this.batch.timeline)
  first = true
  done = false

  curIter = new AbortController()

  lastValue: T = null!
  constructor(batch: Batch, fn: (signal: AbortSignal) => AsyncIterable<T>) {
    super(batch)
    ;(async () => {
      for await (const value of fn(this.signal)) {
        if (this.first) {
          this.first = false
          this.valueQueue.push([0, value])
          this.initPromise.resolve()
        } else {
          this.valueQueue.push([this.eventSource.push(), value])
        }
      }
      this.done = true
      this.eventSource.finish()
    })()
  }

  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    if (this.first) {
      await this.initPromise
    }
    while (time >= this.valueQueue[0]?.[0]!) { // NaN comparisons are false
      receipt.novel = true
      this.lastValue = this.valueQueue.shift()![1]
    }
    const value = this.lastValue
    if (this.valueQueue.length) {
      receipt.setNextTime(this.valueQueue[0]![0])
    } else if (!this.done) {
      receipt.bind(this.eventSource)
    }
    return value
  }
}

export class UnwrappedValue<T = unknown> {
  constructor(readonly value: T) {}
}

class _UnwrapRune<T1, U, T2 extends T1> extends _Rune<T2, U | Exclude<T1, T2>> {
  child
  constructor(batch: Batch, child: Rune<T1, U>, readonly fn: (value: T1) => value is T2) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = await this.child.evaluate(time, receipt)
    if (this.fn(value)) return value
    throw new UnwrappedValue(value)
  }
}

class _CatchRune<T, U> extends _Rune<
  T | Exclude<U, UnwrappedValue<any>>,
  U extends UnwrappedValue<infer X> ? X : never
> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        if (e.value instanceof UnwrappedValue) {
          throw e.value
        } else {
          return e.value as Exclude<U, UnwrappedValue<any>>
        }
      }
      throw e
    }
  }
}

class _WrapURune<T, U> extends _Rune<T, UnwrappedValue<U>> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        throw new UnwrappedValue(e)
      }
      throw e
    }
  }
}

class _LazyRune<T, U> extends _Rune<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, _receipt: Receipt): Promise<T> {
    return await this.child.evaluate(time, new Receipt())
  }
}
