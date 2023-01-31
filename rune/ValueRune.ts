import { PromiseOr } from "../util/types.ts"
import { Batch, Run, Rune, UnwrappedValue } from "./Rune.ts"
import { Receipt } from "./Timeline.ts"

type GetPath<T, P> = P extends [infer K, ...infer Q] ? K extends keyof T ? GetPath<T[K], Q> : never
  : T
type EnsurePath<T, P> = never extends P
  ? P extends [infer K, ...infer Q]
    ? [K] extends [keyof T] ? [K, ...EnsurePath<T[K], Q>] : [keyof T, ...PropertyKey[]]
  : [(keyof T)?]
  : P

export class ValueRune<out T, out U = never> extends Rune<T, U> {
  static override new<T, U, A extends unknown[]>(
    ctor: new(batch: Batch, ...args: A) => Run<T, U>,
    ...args: A
  ) {
    return new ValueRune((batch) => new ctor(batch, ...args))
  }

  map<T2>(fn: (value: T) => PromiseOr<T2>): ValueRune<T2, U> {
    return ValueRune.new(RunMap, this, fn)
  }

  access<T, U, P extends PropertyKey[]>(
    this: ValueRune<T, U>,
    ...keys: EnsurePath<T, P>
  ): ValueRune<GetPath<T, P>, U> {
    return this.map((value: any) => {
      for (const key of keys) {
        value = value[key]
      }
      return value
    })
  }

  unwrap<T2 extends T>(fn: (value: T) => value is T2): ValueRune<T2, U | Exclude<T, T2>> {
    return ValueRune.new(RunUnwrap, this, fn)
  }

  unwrapNot<T2 extends T>(fn: (value: T) => value is T2): ValueRune<Exclude<T, T2>, U | T2>
  unwrapNot<T2 extends T>(
    fn: (value: T) => value is T2,
  ): ValueRune<Exclude<T, T2>, U | Exclude<T, Exclude<T, T2>>> {
    return this.unwrap((value): value is Exclude<T, T2> => !fn(value))
  }

  unwrapError<T, U>(this: ValueRune<T, U>) {
    return this.unwrapNot((x): x is Extract<T, Error> => x instanceof Error)
  }

  unwrapUndefined<T, U>(this: ValueRune<T, U>) {
    return this.unwrapNot((x): x is T & undefined => x === undefined)
  }

  unwrapNull<T, U>(this: ValueRune<T, U>) {
    return this.unwrapNot((x): x is T & null => x === null)
  }

  catch(): ValueRune<
    T | Exclude<U, UnwrappedValue<any>>,
    U extends UnwrappedValue<infer X> ? X : never
  > {
    return ValueRune.new(RunCatch, this)
  }

  wrapU() {
    return ValueRune.new(RunWrapU, this)
  }

  lazy() {
    return ValueRune.new(RunLazy, this)
  }

  filter(fn: (value: T) => boolean): ValueRune<T, U>
  filter<T2 extends T>(fn: (value: T) => value is T2): ValueRune<T2, U>
  filter(fn: (value: T) => boolean): ValueRune<T, U> {
    return ValueRune.new(RunFilter, this, fn)
  }

  final() {
    return ValueRune.new(RunFinal, this)
  }

  reduce<T2>(init: T2, fn: (last: T2, value: T) => PromiseOr<T2>): ValueRune<T2, U> {
    return ValueRune.new(RunReduce, this, init, fn)
  }

  collect() {
    return this.reduce<T[]>([], (arr, val) => {
      arr.push(val)
      return arr
    }).final().singular()
  }

  singular() {
    return ValueRune.new(RunSingular, this)
  }

  dbg(...prefix: unknown[]) {
    return this.map((value) => {
      console.log(...prefix, value)
      return value
    })
  }
}

class RunMap<T1, U, T2> extends Run<T2, U> {
  child
  constructor(
    batch: Batch,
    child: Rune<T1, U>,
    readonly fn: (value: T1) => PromiseOr<T2>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(source)
  }
}

class RunUnwrap<T1, U, T2 extends T1> extends Run<T2, U | Exclude<T1, T2>> {
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

class RunCatch<T, U> extends Run<
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

class RunWrapU<T, U> extends Run<T, UnwrappedValue<U>> {
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

class RunLazy<T, U> extends Run<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, _receipt: Receipt): Promise<T> {
    return await this.child.evaluate(time, new Receipt())
  }
}

class RunFilter<T, U> extends Run<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>, readonly fn: (value: T) => boolean) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  first = true
  lastValue: T = null!
  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const _receipt = new Receipt()
    try {
      const value = await this.child.evaluate(time, _receipt)
      if (!_receipt.ready || !_receipt.novel || this.fn(value)) {
        receipt.setNovel(_receipt.novel)
        this.lastValue = value
        this.first = false
        return value
      } else {
        receipt.setReady(!this.first)
        receipt.novel = true
        return this.lastValue
      }
    } finally {
      receipt.setNextTimeFrom(_receipt)
    }
  }
}

class RunFinal<T, U> extends Run<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const value = await this.child.evaluate(time, receipt)
    await receipt.finalized()
    receipt.setReady(receipt.nextTime === Infinity)
    return value
  }
}

class RunReduce<T1, U, T2> extends Run<T2, U> {
  child
  constructor(
    batch: Batch,
    child: Rune<T1, U>,
    public lastValue: T2,
    readonly fn: (last: T2, value: T1) => PromiseOr<T2>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(this.lastValue, source)
  }
}

class RunSingular<T, U> extends Run<T, U> {
  constructor(batch: Batch, readonly child: Rune<T, U>) {
    super(batch)
  }

  result?: Promise<T>
  _evaluate(time: number, receipt: Receipt): Promise<T> {
    return this.result ??= this.child.run(this.batch.spawn(time, receipt))
  }
}
