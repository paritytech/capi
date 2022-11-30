import { deferred } from "../deps/std/async.ts"
import { Id } from "./id.ts"

export class FutureCtx {}

export abstract class _Future<T, E extends Error> {
  declare "": [T, E]

  abortController = new AbortController()
  constructor(readonly ctx: FutureCtx) {
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

export class Future<T, E extends Error> {
  declare "": [T, E]

  private constructor(readonly id: Id, readonly prime: (ctx: FutureCtx) => _Future<T, E>) {}

  static new<T, E extends Error, A extends unknown[]>(
    ctor: new(ctx: FutureCtx, ...args: A) => _Future<T, E>,
    ...args: A
  ) {
    return new Future(Id.hash(Id.loc``, ctor, ...args), (ctx) => new ctor(ctx, ...args))
  }

  async run(): Promise<T | E> {
    const ctx = new FutureCtx()
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
        result.reject("Rune stopped without pushing any values")
      }
    })
    primed.start()
    return result
  }

  static constant<T>(value: T) {
    return Future.new(_ConstantFuture, value)
  }

  mapValue<R>(
    this: Future<T, E>,
    id: Id,
    fn: (value: T) => R,
  ): Future<Exclude<R, Error>, E | Extract<R, Error>> {
    return Future.new(_MapValueFuture, this, id, fn)
  }

  iter<R>(this: Future<Iterable<R>, E>) {
    return Future.new(_IterFuture, this)
  }

  skip(skip: number): Future<T, E> {
    return Future.new(_SkipFuture, this, skip)
  }

  take(take: number): Future<T, E> {
    return Future.new(_TakeFuture, this, take)
  }

  first(): Future<T, E> {
    return this.take(1)
  }

  static ls<F extends Future<any, any>[]>(
    ...futures: [...F]
  ): Future<
    { [K in keyof F]: F[K] extends Future<infer T, any> ? T : never },
    { [K in keyof F]: F[K] extends Future<any, infer E> ? E : never }[number]
  > {
    return Future.new(_LsFuture, futures)
  }

  throttle(timeout = 0) {
    return Future.new(_ThrottleFuture, this, timeout)
  }

  collect() {
    return Future.new(_CollectFuture, this)
  }
}

export abstract class _SingleWrapperFuture<T1, E1 extends Error, T2 = T1, E2 extends Error = E1>
  extends _Future<T2, E2>
{
  base
  constructor(ctx: FutureCtx, base: Future<T1, E1>) {
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

class _ConstantFuture<T> extends _Future<Exclude<T, Error>, Extract<T, Error>> {
  constructor(ctx: FutureCtx, readonly value: T) {
    super(ctx)
  }

  start(): void {
    this.push(this.value as Exclude<T, Error> | Extract<T, Error>)
    this.stop()
  }
}

class _MapValueFuture<T, E extends Error, R>
  extends _SingleWrapperFuture<T, E, Exclude<R, Error>, E | Extract<R, Error>>
{
  constructor(ctx: FutureCtx, base: Future<T, E>, _id: Id, readonly fn: (value: T) => R) {
    super(ctx, base)
  }

  basePush(value: T | E): void {
    if (value instanceof Error) this.push(value)
    else this.push(this.fn(value) as Exclude<R, Error> | Extract<R, Error>)
  }
}

class _IterFuture<R, E extends Error>
  extends _SingleWrapperFuture<Iterable<R>, E, Exclude<R, Error>, E | Extract<R, Error>>
{
  basePush(value: E | Iterable<R>): void {
    if (value instanceof Error) return this.push(value)
    for (const v of value) {
      this.push(v as Exclude<R, Error> | Extract<R, Error>)
    }
  }
}

class _SkipFuture<T, E extends Error> extends _SingleWrapperFuture<T, E> {
  constructor(ctx: FutureCtx, base: Future<T, E>, readonly skip: number) {
    super(ctx, base)
  }

  basePush(value: T | E): void {
    if (this.base.i >= this.skip) {
      this.push(value)
    }
  }
}

class _TakeFuture<T, E extends Error> extends _SingleWrapperFuture<T, E> {
  constructor(ctx: FutureCtx, base: Future<T, E>, readonly take: number) {
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

class _LsFuture extends _Future<any, any> {
  bases
  constructor(ctx: FutureCtx, bases: Future<any, any>[]) {
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

class _ThrottleFuture<T, E extends Error> extends _SingleWrapperFuture<T, E> {
  waiting = false
  queue: (T | E)[] = []
  done = false
  constructor(ctx: FutureCtx, base: Future<T, E>, public timeout: number) {
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

class _CollectFuture<T, E extends Error> extends _SingleWrapperFuture<T, E, T[], E> {
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
