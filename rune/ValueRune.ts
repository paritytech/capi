import { Guard, SmartExclude } from "./is.ts"
import { Run, Rune, RunicArgs, Runner, Unhandled } from "./Rune.ts"
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

/** @ts-ignore: assume it's a valid key */
type GetPath<T, P> = P extends [infer K, ...infer Q] ? GetPath<T[K], Q> : T

type EnsurePath<T, P> = never extends P ? P extends [infer K, ...infer Q] ?
      | [K & keyof T, ...EnsurePath<T[K & keyof T], Q>]
      | [keyof T, ...PropertyKey[]]
  : [(keyof T)?]
  : P

export class ValueRune<out T, out U = never> extends Rune<T, U> {
  static override new<T, U, A extends unknown[]>(
    ctor: new(runner: Runner, ...args: A) => Run<T, U>,
    ...args: A
  ) {
    return new ValueRune((runner) => new ctor(runner, ...args))
  }

  map<T2>(fn: (value: T) => T2 | Promise<T2>): ValueRune<T2, U> {
    return ValueRune.new(RunMap, this, fn)
  }

  access<P extends (string & {} | "" | number & {} | 0 | symbol)[], T, U, X>(
    this: ValueRune<T, U>,
    ...keys: never extends P ? RunicArgs<X, [...EnsurePath<T, P>]>
      : { [K in keyof P]: P[K] | Rune<P[K], any> }
  ): ValueRune<GetPath<T, { [K in keyof X]: Rune.T<X[K]> }>, U | RunicArgs.U<X>>
  access<X>(
    this: ValueRune<any, U>,
    ...keys: RunicArgs<X, any[]>
  ): ValueRune<any, U | RunicArgs.U<X>> {
    return Rune.tuple([this, ...RunicArgs.resolve(keys)]).map(([value, ...keys]) => {
      for (const key of keys) {
        value = value[key]
      }
      return value
    })
  }

  handle<T2 extends T, T3, U2>(
    guard: Guard<T, T2>,
    alt: (rune: ValueRune<T2, never>) => Rune<T3, U2>,
  ): ValueRune<Exclude<T, T2> | T3, U | U2> {
    return ValueRune.new(RunHandle, this, guard, alt(this as never))
  }

  unhandle<U2 extends T>(fn: Guard<T, U2>): ValueRune<SmartExclude<T, U2>, U | U2>
  unhandle(fn: Guard<T, T>): ValueRune<T, U | T> {
    return ValueRune.new(RunUnhandle, this, fn)
  }

  throws<U2 extends unknown[]>(
    ...guards: { [K in keyof U2]: Guard<unknown, U2[K]> }
  ): ValueRune<T, U | U2[number]>
  throws<U2>(...guards: Array<Guard<unknown, U2>>): ValueRune<T, U | U2> {
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
      RunRehandle,
      this,
      guard,
      alt(
        ValueRune.new(RunGetUnhandled, this)
          .filter((x) => x !== null && guard(x.value))
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

  reduce<T2>(init: T2, fn: (last: T2, value: T) => T2 | Promise<T2>): ValueRune<T2, U> {
    return ValueRune.new(RunReduce, this, init, fn)
  }

  collect() {
    return this.reduce<T[]>([], (arr, val) => {
      arr.push(val)
      return arr
    }).final()
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

  match<T, U, T2, U2>(
    this: ValueRune<T, U>,
    fn: (match: Match<T, never, never>) => ExhaustiveMatch<T2, U2>,
  ): ValueRune<T2, U | U2> {
    const match = new Match<T, never, never>(this as any as ValueRune<T, never>)
    if (fn(match) !== match as any) {
      throw new Error("The callback supplied to match must return the match passed in")
    }
    return ValueRune.new(RunMatch, this as any as ValueRune<T, never>, match.conditions)
  }
}

type ExhaustiveMatch<T, U> = Match<never, T, U>
class Match<M, T, U> {
  conditions: [(x: M) => boolean, ValueRune<T, U>][] = []

  constructor(readonly value: ValueRune<M, never>) {}

  when<M2 extends M, T2, U2>(
    guard: Guard<M, M2>,
    fn: (value: ValueRune<M2, never>) => ValueRune<T2, U2>,
  ): Match<Exclude<M, M2>, T | T2, U | U2> {
    this.conditions.push([guard, fn(this.value as any) as any])
    return this as any
  }

  else<T2, U2>(
    fn: (value: ValueRune<M, never>) => ValueRune<T2, U2>,
  ): ExhaustiveMatch<T | T2, U | U2> {
    this.conditions.push([() => true, fn(this.value as any) as any])
    return this as any
  }
}

class RunMatch<M, T, U> extends Run<T, U> {
  value
  conditions
  constructor(
    runner: Runner,
    child: Rune<M, never>,
    conditions: [(x: M) => boolean, ValueRune<T, U>][],
  ) {
    super(runner)
    this.value = this.use(child)
    this.conditions = conditions.map(([cond, val]) => [cond, this.use(val)] as const)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = await this.value.evaluate(time, receipt) as M
    for (const [cond, val] of this.conditions) {
      if (cond(value)) {
        return await val.evaluate(time, receipt)
      }
    }
    throw new Error("Match was not exhaustive")
  }
}

class RunMap<T1, U, T2> extends Run<T2, U> {
  child
  constructor(
    runner: Runner,
    child: Rune<T1, U>,
    readonly fn: (value: T1) => T2 | Promise<T2>,
  ) {
    super(runner)
    this.child = this.use(child)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(source)
  }
}

Rune.ValueRune = ValueRune

class RunHandle<T, T2 extends T, T3, U, U2> extends Run<Exclude<T, T2> | T3, U | U2> {
  child
  alt
  constructor(
    runner: Runner,
    child: Rune<T, U>,
    readonly guard: Guard<T, T2>,
    alt: Rune<T3, U2>,
  ) {
    super(runner)
    this.child = this.use(child)
    this.alt = this.use(alt)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = await this.child.evaluate(time, receipt) as T
    if (this.guard(value)) {
      return await this.alt.evaluate(time, receipt)
    } else return value as Exclude<T, T2>
  }
}

class RunUnhandle<T, U> extends Run<T, U | T> {
  child
  constructor(
    runner: Runner,
    child: Rune<T, U>,
    readonly guard: Guard<T, T>,
  ) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = (await this.child.evaluate(time, receipt)) as T
    if (this.guard(value)) throw new Unhandled(value, this.trace)
    return value
  }
}

class RunThrows<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(
    runner: Runner,
    child: Rune<T, U1>,
    readonly guards: Array<Guard<unknown, U2>>,
  ) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      for (const guard of this.guards) {
        if (guard(e)) throw new Unhandled(e, this.trace)
      }
      throw e
    }
  }
}

class RunGetUnhandled<T, U> extends Run<Unhandled<U> | null, never> {
  child
  constructor(runner: Runner, child: Rune<T, U>) {
    super(runner)
    this.child = this.use(child)
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

class RunRehandle<T1, U1, U2 extends U1, T3, U3> extends Run<T1 | T3, Exclude<U1, U2> | U3> {
  child
  alt
  constructor(
    runner: Runner,
    child: Rune<T1, U1>,
    readonly fn: (value: U1) => value is U2,
    alt: Rune<T3, U3>,
  ) {
    super(runner)
    this.child = this.use(child)
    this.alt = this.use(alt)
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
  constructor(runner: Runner, child: Rune<T, U>) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, _receipt: Receipt): Promise<T> {
    return await this.child.evaluate(time, new Receipt())
  }
}

class RunFilter<T, U> extends Run<T, U> {
  child
  constructor(runner: Runner, child: Rune<T, U>, readonly fn: (value: T) => boolean) {
    super(runner)
    this.child = this.use(child)
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
  constructor(runner: Runner, child: Rune<T, U>) {
    super(runner)
    this.child = this.use(child)
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
    runner: Runner,
    child: Rune<T1, U>,
    public lastValue: T2,
    readonly fn: (last: T2, value: T1) => T2 | Promise<T2>,
  ) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(this.lastValue, source)
  }
}

class RunChain<T1, U1, T2, U2> extends Run<T2, U1 | U2> {
  first
  second
  constructor(
    runner: Runner,
    first: Rune<T1, U1>,
    second: Rune<T2, U2>,
  ) {
    super(runner)
    this.first = this.use(first)
    this.second = this.use(second)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    await this.first.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.second.evaluate(time, receipt)
  }
}
