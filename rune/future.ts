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
    return Future.new(_MapValueFuture, id, this, fn)
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
  extends _Future<Exclude<R, Error>, E | Extract<R, Error>>
{
  base
  constructor(ctx: FutureCtx, _id: Id, base: Future<T, E>, readonly fn: (value: T) => R) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      if (value instanceof Error) this.push(value)
      else this.push(this.fn(value) as Exclude<R, Error> | Extract<R, Error>)
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.stop()
    })
  }

  start(): void {
    this.base.start()
  }
}

class _IterFuture<R, E extends Error> extends _Future<Exclude<R, Error>, E | Extract<R, Error>> {
  base
  constructor(ctx: FutureCtx, base: Future<Iterable<R>, E>) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      if (value instanceof Error) return this.push(value)
      for (const v of value) {
        this.push(v as Exclude<R, Error> | Extract<R, Error>)
      }
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.stop()
    })
  }

  start(): void {
    this.base.start()
  }
}

class _SkipFuture<T, E extends Error> extends _Future<T, E> {
  base
  constructor(ctx: FutureCtx, base: Future<T, E>, public skip: number) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      if (this.base.i >= skip) {
        this.push(value)
      }
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.stop()
    })
  }

  start(): void {
    this.base.start()
  }
}

class _TakeFuture<T, E extends Error> extends _Future<T, E> {
  base
  constructor(ctx: FutureCtx, base: Future<T, E>, public take: number) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      if (this.base.i < take) {
        this.push(value)
      } else {
        this.stop()
      }
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.stop()
    })
  }

  start(): void {
    this.base.start()
  }
}
