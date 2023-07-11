import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { EventSource, Receipt, Timeline } from "./Timeline.ts"
import { Trace } from "./Trace.ts"

// Hack to work around circularity issues
// @deno-types="./_empty.d.ts"
import * as _ from "./_empty.js"

export abstract class Runner {
  abstract order: number
  abstract timeline: Timeline

  _currentTrace?: Trace
  protected abstract _prime<T, U>(rune: Rune<T, U>): Run<T, U>

  memo = new Map<(runner: Runner) => Run<any, any>, Run<any, any>>()
  prime<T, U>(rune: Rune<T, U>): Run<T, U> {
    const run = getOrInit(this.memo, rune._prime, () => {
      const old = this._currentTrace
      this._currentTrace = rune._trace
      const run = this._prime(rune)
      this._currentTrace = old
      run._sources.push(rune._prime)
      return run
    })
    return run
  }

  getPrimed<T, U>(rune: Rune<T, U>): Run<T, U> | undefined {
    return this.memo.get(rune._prime)
  }

  onCleanup(run: Run<unknown, unknown>) {
    for (const source of run._sources) {
      this.memo.delete(source)
    }
  }
}

class RootRunner extends Runner {
  order = 0
  timeline = new Timeline()

  protected _prime<T, U>(rune: _.Rune<T, U>): _.Run<T, U> {
    return rune._prime(this)
  }
}

const globalRunner = new RootRunner()

declare const _T: unique symbol
declare const _U: unique symbol

export declare namespace Rune {
  export type T<R> = R extends { [_T]: infer T } ? T : R
  export type U<R> = R extends { [_U]: infer U } ? U : never
  export import ValueRune = _.ValueRune
  export import ArrayRune = _.ArrayRune
  export import FnRune = _.FnRune
}

export interface Rune<out T, out U = never> {
  [_T]: T
  [_U]: U
}
export class Rune<out T, out U = never> {
  declare private _
  _trace: Trace

  constructor(readonly _prime: (runner: Runner) => Run<T, U>) {
    this._trace = new Trace(`execution of the ${new.target.name} instantiated`)
  }

  static new<T, U, A extends unknown[]>(
    ctor: new(runner: Runner, ...args: A) => Run<T, U>,
    ...args: A
  ) {
    return new Rune((runner) => new ctor(runner, ...args))
  }

  async run(runner: Runner = globalRunner): Promise<T> {
    for await (const value of this.iter(runner)) {
      return value
    }
    throw new Error("Rune did not yield any values")
  }

  async *iter(runner: Runner = globalRunner) {
    let time = runner.timeline.current
    const primed = runner.prime(this)
    primed.reference()
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
      primed.dereference()
    }
  }

  static constant<T>(value: T) {
    return Rune.ValueRune.new(RunConstant, value)
  }

  static resolve<V>(value: V): Rune.ValueRune<Rune.T<V>, Rune.U<V>> {
    return value instanceof Rune ? value.into(Rune.ValueRune) : Rune.constant(value)
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
  ): Rune.ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[number]>>
  static tuple<R extends unknown[]>(
    runes: [...R],
  ): Rune.ValueRune<Rune.T<R[number]>[], Rune.U<R[number]>> {
    return Rune.ValueRune.new(RunLs, runes.map(Rune.resolve))
  }

  static array<T, X>(runes: RunicArgs<X, T[]>) {
    return Rune.ValueRune.new(RunLs, RunicArgs.resolve(runes)).into(Rune.ArrayRune)
  }

  static fn<A extends any[], T, X>(...[fn]: RunicArgs<X, [(...args: A) => T]>) {
    return Rune.resolve(fn).into(Rune.FnRune)
  }

  static object<R extends {}>(
    runes: R,
  ): Rune.ValueRune<{ [K in keyof R]: Rune.T<R[K]> }, Rune.U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.tuple(values).map((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v])) as any
    })
  }

  static captureUnhandled<R extends unknown[], T2, U2>(
    sources: [...R],
    fn: (
      ...runes: { [K in keyof R]: Rune.ValueRune<Rune.T<R[K]>, never> }
    ) => Rune<T2, U2>,
  ): Rune.ValueRune<T2, Rune.U<R[number]> | U2>
  static captureUnhandled<R, T2, U2>(
    sources: any[],
    fn: (...runes: Rune.ValueRune<Rune.T<R>, never>[]) => Rune<T2, U2>,
  ): Rune.ValueRune<T2, Rune.U<R> | U2> {
    const symbol = Symbol()
    return Rune.ValueRune.new(
      RunCaptureUnhandled<T2, U2, Rune.U<R>>,
      fn(
        ...sources.map((source) =>
          Rune.ValueRune.new(RunBubbleUnhandled, Rune.resolve(source), symbol)
        ),
      ),
      symbol,
    )
  }

  static asyncIter<T>(fn: () => AsyncIterable<T>): Rune.ValueRune<T, never> {
    return Rune.ValueRune.new(RunAsyncIter, fn)
  }

  static _placeholder() {
    return Rune.new(RunPlaceholder)
  }

  into<A extends unknown[], C extends Rune<any, any>>(
    ctor: new(_prime: (runner: Runner) => Run<T, U | RunicArgs.U<A>>, ...args: A) => C,
    ...args: A
  ): C {
    const rune = new ctor(this._prime, ...args)
    rune._trace = this._trace
    return rune
  }

  as<R>(this: R, _ctor: new(_prime: (runner: Runner) => Run<T, U>, ...args: any) => R): R {
    return this
  }

  unsafeAs<T2, U2 = U>(): Rune<T2, U2> {
    return this as never
  }

  pipe<R extends Rune<any, any>>(fn: (rune: this) => R): R {
    return fn(this)
  }

  static pin<T, U>(rune: Rune<T, U>, pinned: Rune<unknown, unknown>): Rune<T, U> {
    return new Rune((runner) => {
      const run = runner.prime(rune)
      run.use(pinned)
      return run
    })
  }
}

export abstract class Run<T, U> {
  declare "": [T, U]
  trace: Trace
  order: number
  timeline

  constructor(readonly runner: Runner) {
    this.trace = runner._currentTrace
      ?? new Trace(`execution of the ${new.target.name} instantiated`)
    this.order = runner.order
    this.timeline = runner.timeline
  }

  dependencies: Run<unknown, unknown>[] = []

  use<T, U>(rune: Rune<T, U>): Run<T, U> {
    const run = this.runner.prime(rune)
    this.useRun(run)
    return run
  }

  useRun(run: Run<unknown, unknown>) {
    run.reference()
    this.dependencies.push(run)
  }

  referenceCount = 0
  alive = true

  reference() {
    if (!this.alive) throw new Error("cannot reference a dead rune")
    this.referenceCount++
  }

  _sources: Array<(runner: Runner) => Run<any, any>> = []
  dereference(cleanupBatches?: Run<unknown, unknown>[][]) {
    if (!--this.referenceCount) {
      this.alive = false
      this.cleanup()
      this.runner.onCleanup(this)
      if (cleanupBatches) {
        cleanupBatches.push(this.dependencies)
      } else {
        const cleanupBatches = [this.dependencies]
        while (cleanupBatches.length) {
          const batch = cleanupBatches.pop()!
          for (const run of batch) {
            run.dereference(cleanupBatches)
          }
        }
      }
    }
  }

  cleanup() {}

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
      this._currentPromise = this.trace.runAsync(() => this._evaluate(time, this._currentReceipt))
    }
    const _receipt = this._currentReceipt
    try {
      return await this._currentPromise
    } finally {
      receipt.setFrom(_receipt)
    }
  }
  abstract _evaluate(time: number, receipt: Receipt): Promise<T>
}

class RunConstant<T> extends Run<T, never> {
  constructor(runner: Runner, readonly value: T) {
    super(runner)
  }

  _evaluate() {
    return Promise.resolve(this.value)
  }
}

class RunLs<T, U> extends Run<T[], U> {
  children
  constructor(runner: Runner, children: Rune<T, U>[]) {
    super(runner)
    this.children = children.map((child) => this.use(child))
  }

  _evaluate(time: number, receipt: Receipt) {
    return Promise.all(this.children.map((child) => child.evaluate(time, receipt)))
  }
}

export abstract class RunStream<T> extends Run<T, never> {
  initPromise = deferred<void>()
  valueQueue: [number, T][] = []
  eventSource = new EventSource(this.timeline)
  first = true
  done = false

  curIter = new AbortController()

  lastValue: T = null!
  constructor(runner: Runner) {
    super(runner)
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
  constructor(runner: Runner, fn: () => AsyncIterable<T>) {
    super(runner)
    ;(async () => {
      for await (const value of fn()) {
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
  constructor(runner: Runner, child: Rune<T, U>, readonly symbol: symbol) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof Unhandled) {
        throw new BubbleUnhandled(this.symbol, e.value, e.trace)
      }
      throw e
    }
  }
}

class RunCaptureUnhandled<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(runner: Runner, child: Rune<T, U1>, readonly symbol: symbol) {
    super(runner)
    this.child = this.use(child)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof BubbleUnhandled && e.symbol === this.symbol) {
        throw new Unhandled(e.value, e.trace)
      }
      throw e
    }
  }
}

class BubbleUnhandled<U> {
  constructor(readonly symbol: symbol, readonly value: U, readonly trace: Trace) {}
}

export class Unhandled<U = unknown> {
  declare private _
  constructor(readonly value: U, readonly trace: Trace) {}
}

export type RunicArgs<X, A> =
  | (never extends X ? never : X extends A ? X : never)
  | { [K in keyof A]: A[K] | Rune<A[K], RunicArgs.U<X>> }

export namespace RunicArgs {
  export type U<X> = X extends unknown[] ? Rune.U<X[number]> : Rune.U<X[keyof X]>
  export function resolve<X, A>(
    args: RunicArgs<X, A>,
  ): { [K in keyof A]: Rune.ValueRune<A[K], RunicArgs.U<X>> }
  export function resolve(args: any): any {
    return args instanceof Array
      ? args.map(Rune.resolve)
      : Object.fromEntries(Object.entries(args).map(([k, v]) => [k, Rune.resolve(v)]))
  }
}
