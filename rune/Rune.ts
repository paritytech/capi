import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { ArrayRune, FnRune, ValueRune } from "./mod.ts"
import { EventSource, Receipt, Timeline } from "./Timeline.ts"

export class Batch {
  constructor(
    readonly timeline = new Timeline(),
    readonly parent?: Batch,
    readonly wrapParent: <T, U>(rune: Run<T, U>) => Run<T, U> = (x) => x,
  ) {}

  primed = new Map<Rune<any, any>["_prime"], Run<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): Run<T, E> {
    const primed = getOrInit(
      this.primed,
      rune._prime,
      () => this.getPrimed(rune) ?? rune._prime(this),
    )
    primed.reference(signal)
    return primed
  }

  getPrimed<T, E>(rune: Rune<T, E>): Run<T, E> | undefined {
    const existing = this.primed.get(rune._prime)
    if (existing) return existing
    const parent = this.parent?.getPrimed(rune)
    if (parent) {
      const wrapped = this.wrapParent(parent)
      this.primed.set(rune._prime, wrapped)
      return wrapped
    }
    return undefined
  }

  spawn(time: number, receipt: Receipt) {
    return new Batch(new Timeline(), this, (x) => new RunProxy(this, x, time, receipt))
  }
}

declare const _T: unique symbol
declare const _U: unique symbol

export namespace Rune {
  export type T<R> = R extends { [_T]: infer T } ? T : R
  export type U<R> = R extends { [_U]: infer U } ? U : never
}

export interface Rune<out T, out U = never> {
  [_T]: T
  [_U]: U
}
export class Rune<out T, out U = never> {
  declare private _

  constructor(readonly _prime: (batch: Batch) => Run<T, U>) {}

  static new<T, U, A extends unknown[]>(
    ctor: new(batch: Batch, ...args: A) => Run<T, U>,
    ...args: A
  ) {
    return new Rune((batch) => new ctor(batch, ...args))
  }

  async run(batch = new Batch()): Promise<T> {
    for await (const value of this.iter(batch)) {
      return value
    }
    throw new Error("Rune did not yield any values")
  }

  async *iter(batch = new Batch()) {
    const abortController = new AbortController()
    const primed = batch.prime(this, abortController.signal)
    let time = 0
    try {
      while (time !== Infinity) {
        const receipt = new Receipt()
        const value = await primed.evaluate(time, receipt)
        if (receipt.ready && receipt.novel) {
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
    return ValueRune.new(RunConstant, value)
  }

  static resolve<V>(value: V): ValueRune<Rune.T<V>, Rune.U<V>> {
    return value instanceof Rune ? value.into(ValueRune) : Rune.constant(value)
  }

  static str<X>(strings: TemplateStringsArray, ..._values: RunicArgs<X, unknown[]>) {
    const values = RunicArgs.resolve(_values)
    return Rune
      .tuple(values)
      .map((values) =>
        strings
          .map((templateString, i) => {
            return i < values.length ? `${templateString}${values[i]}` : templateString
          })
          .join("")
      )
  }

  static tuple<R extends unknown[]>(
    runes: [...R],
  ): ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[number]>>
  static tuple<R extends unknown[]>(
    runes: [...R],
  ): ValueRune<Rune.T<R[number]>[], Rune.U<R[number]>> {
    return ValueRune.new(RunLs, runes.map(Rune.resolve))
  }

  static array<T, X>(runes: RunicArgs<X, T[]>) {
    return ValueRune.new(RunLs, RunicArgs.resolve(runes)).into(ArrayRune)
  }

  static fn<A extends any[], T, X>(...[fn]: RunicArgs<X, [(...args: A) => T]>) {
    return Rune.resolve(fn).into(FnRune)
  }

  static rec<R extends {}>(
    runes: R,
  ): ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.tuple(values).map((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v]))
    })
  }

  static captureUnhandled<R extends unknown[], T2, U2>(
    sources: [...R],
    fn: (
      ...runes: { [K in keyof R]: ValueRune<Rune.T<R[K]>, never> }
    ) => Rune<T2, U2>,
  ): ValueRune<T2, Rune.U<R[number]> | U2>
  static captureUnhandled<R, T2, U2>(
    sources: any[],
    fn: (...runes: ValueRune<Rune.T<R>, never>[]) => Rune<T2, U2>,
  ): ValueRune<T2, Rune.U<R> | U2> {
    const symbol = Symbol()
    return ValueRune.new(
      RunCaptureUnhandled<T2, U2, Rune.U<R>>,
      fn(
        ...sources.map((source) => ValueRune.new(RunBubbleUnhandled, Rune.resolve(source), symbol)),
      ),
      symbol,
    )
  }

  static asyncIter<T>(fn: (signal: AbortSignal) => AsyncIterable<T>): ValueRune<T, never> {
    return ValueRune.new(RunAsyncIter, fn)
  }

  static _placeholder() {
    return Rune.new(RunPlaceholder)
  }

  into<A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => Run<T, U | RunicArgs.U<A>>, ...args: A) => C,
    ...args: A
  ): C {
    return new ctor(this._prime, ...args)
  }

  as<R>(this: R, _ctor: new(_prime: (batch: Batch) => Run<T, U>, ...args: any) => R): R {
    return this
  }

  unsafeAs<T2, U2 = U>(): Rune<T2, U2> {
    return this as never
  }

  pipe<R extends Rune<any, any>>(fn: (rune: this) => R): R {
    return fn(this)
  }
}

export abstract class Run<T, U> {
  declare "": [T, U]

  abortController = new AbortController()
  signal = this.abortController.signal
  constructor(readonly batch: Batch) {
    this.signal.addEventListener("abort", () => this.cleanup())
  }

  referenceCount = 0
  reference(signal: AbortSignal) {
    if (!this.alive) throw new Error("cannot reference a dead rune")
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
    try {
      return await this._currentPromise
    } finally {
      receipt.setFrom(_receipt)
    }
  }
  abstract _evaluate(time: number, receipt: Receipt): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

class RunProxy<T, E> extends Run<T, E> {
  constructor(
    batch: Batch,
    readonly inner: Run<T, E>,
    readonly innerTime: number,
    readonly innerReceipt: Receipt,
  ) {
    super(batch)
  }

  _evaluate(): Promise<T> {
    // TODO: improve
    return this.inner.evaluate(this.innerTime, this.innerReceipt)
  }
}

class RunConstant<T> extends Run<T, never> {
  constructor(batch: Batch, readonly value: T) {
    super(batch)
  }

  _evaluate() {
    return Promise.resolve(this.value)
  }
}

class RunLs<T, U> extends Run<T[], U> {
  children
  constructor(batch: Batch, children: Rune<T, U>[]) {
    super(batch)
    this.children = children.map((child) => batch.prime(child, this.signal))
  }

  _evaluate(time: number, receipt: Receipt) {
    return Promise.all(this.children.map((child) => child.evaluate(time, receipt)))
  }
}

export abstract class RunStream<T> extends Run<T, never> {
  initPromise = deferred<void>()
  valueQueue: [number, T][] = []
  eventSource = new EventSource(this.batch.timeline)
  first = true
  done = false

  curIter = new AbortController()

  lastValue: T = null!
  constructor(batch: Batch) {
    super(batch)
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

  push(value: T) {
    if (this.first) {
      this.first = false
      this.valueQueue.push([0, value])
      this.initPromise.resolve()
    } else {
      this.valueQueue.push([this.eventSource.push(), value])
    }
  }

  finish() {
    this.done = true
    this.eventSource.finish()
  }
}

class RunAsyncIter<T> extends RunStream<T> {
  constructor(batch: Batch, fn: (signal: AbortSignal) => AsyncIterable<T>) {
    super(batch)
    ;(async () => {
      for await (const value of fn(this.signal)) {
        this.push(value)
      }
      this.finish()
    })()
  }
}

class RunPlaceholder extends Run<never, never> {
  _evaluate(): Promise<never> {
    return Promise.reject(new Error("PlaceholderRune should not be evaluated"))
  }
}

class RunBubbleUnhandled<T, U> extends Run<T, never> {
  child
  constructor(batch: Batch, child: Rune<T, U>, readonly symbol: symbol) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof Unhandled) {
        throw new BubbleUnhandled(this.symbol, e.value)
      }
      throw e
    }
  }
}

class RunCaptureUnhandled<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(batch: Batch, child: Rune<T, U1>, readonly symbol: symbol) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof BubbleUnhandled && e.symbol === this.symbol) {
        throw new Unhandled(e.value)
      }
      throw e
    }
  }
}

class BubbleUnhandled<U> {
  constructor(readonly symbol: symbol, readonly value: U) {}
}

export class Unhandled<U = unknown> {
  declare private _
  constructor(readonly value: U) {}
}

export type RunicArgs<X, A> =
  | (never extends X ? never : X extends A ? X : never)
  | { [K in keyof A]: A[K] | Rune<A[K], RunicArgs.U<X>> }

export namespace RunicArgs {
  export type U<X> = X extends unknown[] ? Rune.U<X[number]> : Rune.U<X[keyof X]>
  export function resolve<X, A>(
    args: RunicArgs<X, A>,
  ): { [K in keyof A]: ValueRune<A[K], RunicArgs.U<X>> }
  export function resolve(args: any): any {
    return args instanceof Array
      ? args.map(Rune.resolve)
      : Object.fromEntries(Object.entries(args).map(([k, v]) => [k, Rune.resolve(v)]))
  }
}
