import { getOrInit } from "./state.ts"

export class AsyncMemo<K, V> {
  running = new Map<K, Promise<V>>()

  run(key: K, run: () => Promise<V>) {
    return getOrInit(this.running, key, () => run().finally(() => this.running.delete(key)))
  }
}

export class TimedMemo<K, V> extends AsyncMemo<K, V> {
  done = new Map<K, V>()
  timers = new Set<number>()

  constructor(readonly ttl: number, readonly signal: AbortSignal) {
    super()
    this.signal.addEventListener("abort", () => {
      for (const timer of this.timers) {
        clearTimeout(timer)
      }
    })
  }

  override run(key: K, run: () => Promise<V>, ttl = this.ttl) {
    const existing = this.done.get(key)
    if (existing) return Promise.resolve(existing)
    return super.run(key, () =>
      run().then((value) => {
        this.done.set(key, value)
        const timer = setTimeout(() => {
          this.done.delete(key)
          this.timers.delete(timer)
        }, ttl)
        this.timers.add(timer)
        if (Deno.unrefTimer) {
          Deno.unrefTimer(timer)
        }
        return value
      }))
  }
}

export class PermanentMemo<K, V> extends AsyncMemo<K, V> {
  done = new Map<K, V>()

  override run(key: K, run: () => Promise<V>) {
    const existing = this.done.get(key)
    if (existing) return Promise.resolve(existing)
    return super.run(key, () =>
      run().then((value) => {
        this.done.set(key, value)
        return value
      }))
  }
}

export class WeakMemo<K, V extends object> extends AsyncMemo<K, V> {
  done = new Map<K, WeakRef<V>>()
  finReg = new FinalizationRegistry<K>((key) => this.done.delete(key))

  override run(key: K, run: () => Promise<V>) {
    const existing = this.done.get(key)?.deref()
    if (existing) return Promise.resolve(existing)
    return super.run(key, () =>
      run().then((value) => {
        this.done.set(key, new WeakRef(value))
        return value
      }))
  }
}
