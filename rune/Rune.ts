import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { ValueRune } from "./mod.ts"
import { EventSource, Receipt, Timeline } from "./Timeline.ts"

export class Batch {
  constructor(
    readonly timeline = new Timeline(),
    readonly parent?: Batch,
    readonly wrapParent: <T, U>(rune: Run<T, U>) => Run<T, U> = (x) => x,
  ) {}

  primed = new Map<Rune<any, any>, Run<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): Run<T, E> {
    const primed = getOrInit(this.primed, rune, () => this.getPrimed(rune) ?? rune._prime(this))
    primed.reference(signal)
    return primed
  }

  getPrimed<T, E>(rune: Rune<T, E>): Run<T, E> | undefined {
    const existing = this.primed.get(rune)
    if (existing) return existing
    const parent = this.parent?.getPrimed(rune)
    if (parent) {
      const wrapped = this.wrapParent(parent)
      this.primed.set(rune, wrapped)
      return wrapped
    }
    return undefined
  }

  spawn(time: number, receipt: Receipt) {
    return new Batch(new Timeline(), this, (x) => new RunProxy(this, x, time, receipt))
  }
}

export namespace Rune {
  export type T<R> = R extends Rune<any, any> ? R[""][0] : R
  export type U<R> = R extends Rune<any, any> ? R[""][1] : never
}

export class Rune<out T, out U = never> {
  declare "": [T, U]

  constructor(readonly _prime: (batch: Batch) => Run<T, U>) {}

  static new<T, U, A extends unknown[]>(
    ctor: new(batch: Batch, ...args: A) => Run<T, U>,
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

  async *watch(batch = new Batch()) {
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
    return value instanceof Rune ? value.as(ValueRune) : Rune.constant(value)
  }

  static ls<R extends unknown[]>(
    runes: [...R],
  ): ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[number]>>
  static ls<R extends unknown[]>(
    runes: [...R],
  ): ValueRune<Rune.T<R[number]>[], Rune.U<R[number]>> {
    return ValueRune.new(RunLs, runes.map(Rune.resolve))
  }

  static rec<R extends {}>(
    runes: R,
  ): ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.ls(values).map((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v]))
    })
  }

  static asyncIter<T>(fn: (signal: AbortSignal) => AsyncIterable<T>): ValueRune<T, never> {
    return ValueRune.new(RunAsyncIter, fn)
  }

  static _placeholder() {
    return Rune.new(RunPlaceholder)
  }

  as<T, U>(this: Rune<T, U>): Rune<T, U>
  as<A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => Run<T, U>, ...args: A) => C,
    ...args: A
  ): C
  as<A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => Run<T, U>, ...args: A) => C = Rune as any,
    ...args: A
  ) {
    return new ctor(this._prime, ...args)
  }

  unsafeAs<T2 extends T, U2 extends U = U>(): Rune<T2, U2>
  unsafeAs<T2 extends T, U2 extends U, A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => Run<T2, U2>, ...args: A) => C,
    ...args: A
  ): C
  unsafeAs<T2 extends T, U2 extends U, A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => Run<T2, U2>, ...args: A) => C = Rune as any,
    ...args: A
  ) {
    return new ctor(this._prime as any, ...args)
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

export class UnwrappedValue<U = unknown> {
  declare private _
  constructor(readonly value: U) {}
}
