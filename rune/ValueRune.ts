import { PromiseOr } from "../util/types.ts"
import { Batch, Run, Rune, RunicArgs, Unhandled } from "./Rune.ts"
import { Receipt } from "./Timeline.ts"

type NonIndexSignatureKeys<T> = T extends T ? keyof {
    [K in keyof T as {} extends Record<K, never> ? never : K]: T[K]
  }
  : never
type Access<T, K extends keyof T, _K = NonIndexSignatureKeys<T>> = [
  | T[K]
  | Exclude<
    undefined,
    _K extends keyof any ? Record<K, never> extends Record<_K, never> ? undefined
      : never
      : never
  >,
][0]

type GetPath<T, P> = P extends [infer K, ...infer Q]
  ? T extends {} ? K extends keyof T ? GetPath<Access<T, K>, Q> : never : T
  : T
type EnsurePath<T, P> = T extends {}
  ? never extends P
    ? P extends [infer K, ...infer Q] ? [K] extends [keyof T] ? [K, ...EnsurePath<T[K], Q>]
      : [keyof T, ...PropertyKey[]]
    : [(keyof T)?]
  : P
  : []

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

  access<P extends PropertyKey[], T, U>(
    this: ValueRune<T, U>,
    ...keys: EnsurePath<T, P>
  ): ValueRune<GetPath<T, P>, U> {
    return this.map((value: any) => {
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    })
  }

  unhandle<U2 extends T>(fn: Guard<T, U2>): ValueRune<Unguard<T, U2>, U | U2>
  unhandle(fn: Guard<T, T>): ValueRune<T, U | T> {
    return ValueRune.new(RunUnhandle, this, fn)
  }

  throws<U2 extends unknown[]>(
    ...guards: { [K in keyof U2]: Guard<unknown, U2[K]> }
  ): ValueRune<T, U | U2[number]>
  throws<U2>(...guards: Array<abstract new(...args: any[]) => U2>): ValueRune<T, U | U2> {
    return ValueRune.new(RunThrows, this, guards)
  }

  rehandle<U2 extends U>(
    guard: Guard<U, U2>,
  ): ValueRune<T | U2, Exclude<U, U2>>
  rehandle<U2 extends U, T3, U3>(
    guard: Guard<U, U2>,
    alt: (rune: ValueRune<U2, never>) => Rune<T3, U3>,
  ): ValueRune<T | T3, Exclude<U, U2> | U3>
  rehandle<U2 extends U, T3, U3>(
    guard: Guard<U, U2>,
    alt: (rune: ValueRune<U2, never>) => Rune<T3, U3> = (x) => x as any,
  ): ValueRune<T | T3, Exclude<U, U2> | U3> {
    return ValueRune.new(
      RunHandle,
      this,
      (x: U): x is U2 => checkGuard(x, guard),
      alt(
        ValueRune.new(RunGetUnhandled, this)
          .filter((x) => x !== null && checkGuard(x.value, guard))
          .map((x) => x!.value),
      ),
    )
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

  dbg<X>(...prefix: RunicArgs<X, unknown[]>) {
    return Rune
      .tuple([this, Rune.tuple(prefix).lazy()])
      .map(([value, prefix]) => {
        console.log(...prefix, value)
        return value
      })
  }

  chain<T2, U2>(fn: (result: ValueRune<T, never>) => Rune<T2, U2>): ValueRune<T2, U | U2> {
    return ValueRune.new(RunChain, this, fn(this as never))
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

class RunUnhandle<T, U> extends Run<T, U | T> {
  child
  constructor(batch: Batch, child: Rune<T, U>, readonly guard: Guard<T, T>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = (await this.child.evaluate(time, receipt)) as T
    if (checkGuard(value, this.guard)) throw new Unhandled(value)
    return value
  }
}

class RunThrows<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(
    batch: Batch,
    child: Rune<T, U1>,
    readonly guards: Array<Guard<unknown, U2>>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      for (const guard of this.guards) {
        if (checkGuard(e, guard)) throw new Unhandled(e)
      }
      throw e
    }
  }
}

class RunGetUnhandled<T, U> extends Run<Unhandled<U> | null, never> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      await this.child.evaluate(time, receipt)
      return null
    } catch (e) {
      if (e instanceof Unhandled) {
        return e
      }
      throw e
    }
  }
}

class RunHandle<T1, U1, U2 extends U1, T3, U3> extends Run<T1 | T3, Exclude<U1, U2> | U3> {
  child
  alt
  constructor(
    batch: Batch,
    child: Rune<T1, U1>,
    readonly fn: (value: U1) => value is U2,
    alt: Rune<T3, U3>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
    this.alt = batch.prime(alt, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof Unhandled && this.fn(e.value)) {
        return await this.alt.evaluate(time, receipt)
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

class RunChain<T1, U1, T2, U2> extends Run<T2, U1 | U2> {
  first
  second
  constructor(
    batch: Batch,
    first: Rune<T1, U1>,
    second: Rune<T2, U2>,
  ) {
    super(batch)
    this.first = batch.prime(first, this.signal)
    this.second = batch.prime(second, this.signal)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    await this.first.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.second.evaluate(time, receipt)
  }
}

export type Guard<T1, T2 extends T1> =
  | (abstract new(...args: any) => T2)
  | ((value: T1) => value is T2)
  | Extract<T2, null | undefined>

// en garde!
export type Unguard<T1, T2 extends T1> = T2 extends null | undefined
  ? T1 & Exclude<{} | null | undefined, T2>
  : Exclude<T1, T2>

export function checkGuard<T1, T2 extends T1>(value: T1, guard: Guard<T1, T2>): value is T2 {
  if (guard == null) return value === guard
  try {
    if (value instanceof guard) return true
  } catch {}
  try {
    if ((guard as any)(value)) return true
  } catch {}
  return false
}
