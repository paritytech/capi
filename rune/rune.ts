import { deferred } from "../deps/std/async.ts"
import { Id } from "./id.ts"

export interface RuneProps {
  id: Id
  prime(ctx: Invocation): () => void
}

export class Invocation {}

export abstract class PrimedRune<R> {
  abortController = new AbortController()
  constructor(readonly ctx: Invocation) {
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

  listeners = new Set<(value: R) => void>()
  onPush(cb: (value: R) => void, signal: AbortSignal) {
    this.listeners.add(cb)
    signal.addEventListener("abort", () => this.listeners.delete(cb))
  }

  push(value: R) {
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

export class Rune<T, E extends Error> {
  constructor(readonly id: Id, readonly prime: (ctx: Invocation) => PrimedRune<T | E>) {}

  async run(): Promise<T | E> {
    const ctx = new Invocation()
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
}
