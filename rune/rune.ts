import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { Id } from "./id.ts"

export class RuneCtx {}

export type _T<F> = F extends Rune<infer T, any> ? T : Exclude<F, Error>
export type _E<F> = F extends Rune<any, infer E> ? E : Extract<F, Error>

export abstract class _Rune<T, E extends Error> {
  declare "": [T, E]

  abortController = new AbortController()
  constructor(readonly ctx: RuneCtx) {
    this.abortController.signal.addEventListener("abort", () => this.cleanup())
  }

  referenceCount = 0
  alive = true
  reference(signal: AbortSignal) {
    this.referenceCount++
    signal.addEventListener("abort", () => {
      if (!--this.referenceCount) {
        this.abortController.abort()
      }
    })
  }

  // Typed as any to preserve covariance
  listeners = new Set<(value: any) => void>()
  onPush(cb: (value: T | E) => void, signal: AbortSignal) {
    this.listeners.add(cb)
    signal.addEventListener("abort", () => this.listeners.delete(cb))
  }

  i = 0
  push(value: T | E) {
    for (const listener of this.listeners) {
      try {
        listener(value)
      } catch (e) {
        console.error("BUG: Unhandled listener error:", e)
      }
    }
    this.i++
  }

  stop() {
    this.abortController.abort()
  }

  abstract start(): void

  cleanup() {
    this.alive = false
  }
}

export class Rune<T, E extends Error> {
  declare "": [T, E]
  prime
  private constructor(readonly id: Id, prime: (ctx: RuneCtx) => _Rune<T, E>) {
    const memo = new WeakMap<RuneCtx, _Rune<T, E>>()
    this.prime = (ctx: RuneCtx) => getOrInit(memo, ctx, () => prime(ctx))
  }

  static new<T, E extends Error, A extends unknown[]>(
    ctor: new(ctx: RuneCtx, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune(Id.hash(Id.loc``, ctor, ...args), (ctx) => new ctor(ctx, ...args))
  }

  async run(): Promise<T | E> {
    const ctx = new RuneCtx()
    const primed = this.prime(ctx)
    const result = deferred<T | E>()
    let done = false
    primed.onPush((value) => {
      if (!done) {
        result.resolve(value)
        done = true
        primed.stop()
      }
    }, primed.abortController.signal)
    primed.abortController.signal.addEventListener("abort", () => {
      if (!done) {
        result.reject(new Error("Rune stopped without pushing any values"))
      }
    })
    primed.start()
    return result
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _E<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<R>(
    id: Id,
    fn: (value: T) => PromiseOr<R>,
  ): Rune<Exclude<R, Error>, E | Extract<R, Error>> {
    return Rune.new(PipeRune, this, id, fn)
  }

  iter<R>(this: Rune<Iterable<R>, E>) {
    return Rune.new(_IterRune, this)
  }

  skip(skip: number): Rune<T, E> {
    return Rune.new(_SkipRune, this, skip)
  }

  take(take: number): Rune<T, E> {
    return Rune.new(_TakeRune, this, take)
  }

  first(): Rune<T, E> {
    return this.take(1)
  }

  static ls<F extends unknown[]>(Runes: [...F]): Rune<
    { [K in keyof F]: _T<F[K]> },
    _E<F[number]>
  > {
    return Rune.new(_LsRune, Runes.map(Rune.resolve))
  }

  throttle(timeout = 0) {
    return Rune.new(_ThrottleRune, this, timeout)
  }

  debounce() {
    return Rune.new(_DebounceRune, this)
  }

  collect() {
    return Rune.new(_CollectRune, this)
  }
}

export abstract class _SingleWrapperRune<T1, E1 extends Error, T2 = T1, E2 extends Error = E1>
  extends _Rune<T2, E2>
{
  base
  constructor(ctx: RuneCtx, base: Rune<T1, E1>) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      this.basePush(value)
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.baseStop()
    })
  }

  abstract basePush(value: T1 | E1): void

  baseStop() {
    this.stop()
  }

  start(): void {
    this.base.start()
  }
}

class _ConstantRune<T> extends _Rune<Exclude<T, Error>, Extract<T, Error>> {
  constructor(ctx: RuneCtx, readonly value: T) {
    super(ctx)
  }

  start(): void {
    this.push(this.value as Exclude<T, Error> | Extract<T, Error>)
    this.stop()
  }
}

class PipeRune<T, E extends Error, R>
  extends _SingleWrapperRune<T, E, Exclude<R, Error>, E | Extract<R, Error>>
{
  queue: T[] = []
  waiting = false
  done = false
  constructor(
    ctx: RuneCtx,
    base: Rune<T, E>,
    _id: Id,
    readonly fn: (value: T) => PromiseOr<R>,
  ) {
    super(ctx, base)
  }

  basePush(value: T | E): void {
    if (value instanceof Error) return this.push(value)
    this.queue.push(value)
    this.flushQueue()
  }

  override baseStop(): void {
    this.done = true
    this.flushQueue()
  }

  async flushQueue() {
    if (this.waiting) return
    if (!this.queue.length) {
      if (this.done) this.stop()
      return
    }
    this.waiting = true
    this.push(await this.fn(this.queue.shift()!) as Exclude<R, Error> | Extract<R, Error>)
    this.waiting = false
    this.flushQueue()
  }
}

class _IterRune<R, E extends Error>
  extends _SingleWrapperRune<Iterable<R>, E, Exclude<R, Error>, E | Extract<R, Error>>
{
  basePush(value: E | Iterable<R>): void {
    if (value instanceof Error) return this.push(value)
    for (const v of value) {
      this.push(v as Exclude<R, Error> | Extract<R, Error>)
    }
  }
}

class _SkipRune<T, E extends Error> extends _SingleWrapperRune<T, E> {
  constructor(ctx: RuneCtx, base: Rune<T, E>, readonly skip: number) {
    super(ctx, base)
  }

  basePush(value: T | E): void {
    if (this.base.i >= this.skip) {
      this.push(value)
    }
  }
}

class _TakeRune<T, E extends Error> extends _SingleWrapperRune<T, E> {
  constructor(ctx: RuneCtx, base: Rune<T, E>, readonly take: number) {
    super(ctx, base)
  }

  basePush(value: T | E): void {
    if (this.base.i < this.take) {
      this.push(value)
    } else {
      this.stop()
    }
  }
}

class _LsRune extends _Rune<any, any> {
  bases
  constructor(ctx: RuneCtx, bases: Rune<any, any>[]) {
    super(ctx)
    this.bases = bases.map((base) => base.prime(ctx))
    const values: any[] = Array(bases.length)
    let started = 0
    let finished = 0
    for (let i = 0; i < this.bases.length; i++) {
      const base = this.bases[i]!
      base.onPush((value) => {
        if (value instanceof Error) {
          return this.push(value)
        }
        if (!(i in values)) {
          started++
        }
        values[i] = value
        if (started === bases.length) {
          this.push(values.slice())
        }
      }, this.abortController.signal)
      base.abortController.signal.addEventListener("abort", () => {
        finished++
        if (finished === bases.length) {
          this.stop()
        }
      })
    }
  }

  start(): void {
    for (const base of this.bases) {
      base.start()
    }
  }
}

class _DebounceRune<T, E extends Error> extends _SingleWrapperRune<T, E> {
  timer: number | null = null
  done = false

  basePush(value: T | E) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.timer = null
      this.push(value)
      if (this.done) this.stop()
    }, 0)
  }

  override baseStop(): void {
    this.done = true
    if (!this.timer) this.stop()
  }
}

class _ThrottleRune<T, E extends Error> extends _SingleWrapperRune<T, E> {
  waiting = false
  queue: (T | E)[] = []
  done = false
  constructor(ctx: RuneCtx, base: Rune<T, E>, public timeout: number) {
    super(ctx, base)
  }

  basePush(value: T | E) {
    this.queue.push(value)
    this.tryFlush()
  }

  override baseStop(): void {
    this.done = true
    this.tryFlush()
  }

  tryFlush() {
    if (this.waiting) return
    if (this.queue.length) {
      this.push(this.queue.shift()!)
      this.waiting = true
      setTimeout(() => {
        this.waiting = false
        this.tryFlush()
      }, this.timeout)
    } else if (this.done) {
      this.stop()
    }
  }
}

class _CollectRune<T, E extends Error> extends _SingleWrapperRune<T, E, T[], E> {
  values: T[] = []

  basePush(value: T | E): void {
    if (value instanceof Error) return this.push(value)
    this.values.push(value)
  }

  override baseStop(): void {
    this.push(this.values)
    this.stop()
  }
}
