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

  push(value: T | E) {
    for (const listener of this.listeners) {
      try {
        listener(value)
      } catch (e) {
        console.error("BUG: Unhandled listener error:", e)
      }
    }
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
    id: Id,
    ctor: new(ctx: FutureCtx, ...args: A) => _Future<T, E>,
    ...args: A
  ) {
    return new Future(Id.hash(id, ...args), (ctx) => new ctor(ctx, ...args))
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
    return Future.new(Id.hash(Id.loc``, value), _ConstantFuture, value)
  }

  mapValue<T, E extends Error, U>(
    this: Future<T, E>,
    id: Id,
    fn: (value: T) => U,
  ): Future<Exclude<U, Error>, E | Extract<U, Error>> {
    return Future.new(
      Id.loc``,
      _MapValueFuture,
      id,
      this,
      fn,
    )
  }
}

class _ConstantFuture<T> extends _Future<T, never> {
  constructor(ctx: FutureCtx, readonly value: T) {
    super(ctx)
  }

  start(): void {
    this.push(this.value)
    this.stop()
  }
}

export class _MapValueFuture<T, E extends Error, U>
  extends _Future<Exclude<U, Error>, E | Extract<U, Error>>
{
  base
  constructor(ctx: FutureCtx, _id: Id, base: Future<T, E>, readonly fn: (value: T) => U) {
    super(ctx)
    this.base = base.prime(ctx)
    this.base.onPush((value) => {
      if (value instanceof Error) this.push(value)
      else this.push(this.fn(value) as Exclude<U, Error> | Extract<U, Error>)
    }, this.abortController.signal)
    this.base.abortController.signal.addEventListener("abort", () => {
      this.stop()
    })
  }

  start(): void {
    this.base.start()
  }
}
