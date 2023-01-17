import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { Epoch, EpochHandle, Timeline } from "./timeline.ts"

export class Context {
  timeline = new Timeline()

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
  constructor(readonly ctx: Context) {
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

  abstract evaluate(time: number, epoch: Epoch): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

export abstract class _LinearRune<T, U> extends _Rune<T, U> {
  lastTime = -1
  lastValue: Promise<T> = Promise.resolve(null!)
  lastEpoch: Epoch | null = null
  async evaluate(time: number, epoch: Epoch): Promise<T> {
    if (time < this.lastTime) throw new Error("cannot regress")
    if (!this.lastEpoch?.contains(time)) {
      this.lastTime = time
      this.lastEpoch = new Epoch(this.ctx.timeline)
      this.lastValue = this._evaluate(time, this.lastEpoch)
    }
    epoch.restrictTo(this.lastEpoch)
    return this.lastValue
  }

  abstract _evaluate(time: number, epoch: Epoch): Promise<T>
}

export class Rune<T, U = never> {
  declare "": [T, U]

  constructor(readonly _prime: (ctx: Context) => _Rune<T, U>) {}

  static new<T, E, A extends unknown[]>(
    ctor: new(ctx: Context, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((ctx) => new ctor(ctx, ...args))
  }

  async run(): Promise<T> {
    const ctx = new Context()
    const abortController = new AbortController()
    const primed = ctx.prime(this, abortController.signal)
    const result = await primed.evaluate(0, new Epoch(ctx.timeline))
    abortController.abort()
    return result
  }

  async *watch(): AsyncIterable<T> {
    const ctx = new Context()
    const abortController = new AbortController()
    const primed = ctx.prime(this, abortController.signal)
    let time = 0
    let lastValue: T = null!
    let lastTime = 0
    while (true) {
      const epoch = new Epoch(ctx.timeline)
      const promise = primed.evaluate(time, epoch)
      if (!epoch.contains(lastTime)) yield lastValue
      lastValue = await promise
      if (!epoch.finite) {
        if (epoch.handles.size) await epoch.finalized
        if (!epoch.finite) break
      }
      lastTime = time
      time = epoch.max + 1
    }
    yield lastValue
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

  static rec<R extends {}>(
    runes: R,
  ): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.ls(values).pipe((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v]))
    })
  }

  static stream<T>(fn: () => AsyncIterable<T>) {
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

  catch() {
    return Rune.new(_CatchRune, this)
  }

  wrapU() {
    return Rune.new(_WrapURune, this)
  }

  lazy() {
    return Rune.new(_LazyRune, this)
  }

  latest() {
    return Rune.new(_LatestRune, this)
  }

  as<T2 extends T, U2 extends U = U>(): Rune<T2, U2> {
    return new Rune(this._prime as any)
  }

  subclass<A extends unknown[], C>(
    ctor: new(_prime: (ctx: Context) => _Rune<T, U>, ...args: A) => C,
    ...args: A
  ) {
    return new ctor(this._prime, ...args)
  }
}

class _ConstantRune<T> extends _Rune<T, never> {
  constructor(ctx: Context, readonly value: T) {
    super(ctx)
  }

  async evaluate() {
    return this.value
  }
}

class _PipeRune<T1, U, T2> extends _LinearRune<T2, U> {
  child
  constructor(ctx: Context, child: Rune<T1, U>, readonly fn: (value: T1) => PromiseOr<T2>) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    return await this.fn(await this.child.evaluate(time, epoch))
  }
}

class _LsRune<T, U> extends _LinearRune<T[], U> {
  children
  constructor(ctx: Context, children: Rune<T, U>[]) {
    super(ctx)
    this.children = children.map((child) => ctx.prime(child, this.signal))
  }

  async _evaluate(time: number, epoch: Epoch) {
    return Promise.all(this.children.map((child) => child.evaluate(time, epoch)))
  }
}

class _StreamRune<T> extends _LinearRune<T, never> {
  initProm = deferred<void>()
  values: (T | undefined)[] = []
  epochHandle = new EpochHandle(this.ctx.timeline)
  done = false
  constructor(ctx: Context, fn: (signal?: AbortSignal) => AsyncIterable<T>) {
    super(ctx)
    ;(async () => {
      const iter = fn(this.signal)
      let first = true
      for await (const value of iter) {
        if (first) {
          first = false
          this.values[0] = value
          this.initProm.resolve()
        } else {
          this.epochHandle.terminateEpochs()
          this.values[++this.ctx.timeline.time] = value
        }
      }
      this.epochHandle.release()
      this.done = true
    })()
  }

  async _evaluate(time: number, epoch: Epoch): Promise<T> {
    if (!this.values.length) {
      epoch.bind(this.epochHandle)
      await this.initProm
    }
    let end = Infinity
    const idx = this.values.findLastIndex((_, i) => {
      if (i <= time) return true
      end = i - 1
      return false
    })
    epoch.restrictMin(idx)
    epoch.restrictMax(end)
    if (end === Infinity && !this.done) {
      epoch.bind(this.epochHandle)
    }
    return this.values[idx]!
  }
}

export class UnwrappedValue<T = unknown> {
  constructor(readonly value: T) {}
}

class _UnwrapRune<T1, U, T2 extends T1> extends _LinearRune<T2, U | Exclude<T1, T2>> {
  child
  constructor(ctx: Context, child: Rune<T1, U>, readonly fn: (value: T1) => value is T2) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    const value = await this.child.evaluate(time, epoch)
    if (this.fn(value)) return value
    throw new UnwrappedValue(value)
  }
}

class _CatchRune<T, U> extends _LinearRune<
  T | Exclude<U, UnwrappedValue<any>>,
  U extends UnwrappedValue<infer X> ? X : never
> {
  child
  constructor(ctx: Context, child: Rune<T, U>) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    try {
      return await this.child.evaluate(time, epoch)
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

class _WrapURune<T, U> extends _LinearRune<T, UnwrappedValue<U>> {
  child
  constructor(ctx: Context, child: Rune<T, U>) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    try {
      return await this.child.evaluate(time, epoch)
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
  constructor(ctx: Context, child: Rune<T, U>) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  evaluate(time: number, epoch: Epoch): Promise<T> {
    const _epoch = new Epoch(this.ctx.timeline)
    const promise = this.child.evaluate(time, _epoch)
    epoch.restrictMin(_epoch.min)
    return promise
  }
}

// TODO: abort rather than just filtering
class _LatestRune<T, U> extends _Rune<T, U> {
  child
  constructor(ctx: Context, child: Rune<T, U>) {
    super(ctx)
    this.child = ctx.prime(child, this.signal)
  }

  evaluate(time: number, epoch: Epoch): Promise<T> {
    const _epoch = new Epoch(this.ctx.timeline)
    const promise = this.child.evaluate(time, _epoch)
    epoch.restrictMaxTo(_epoch)
    return promise
  }
}
