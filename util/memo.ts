// deno-lint-ignore-file require-await

import { getOrInit } from "./map.ts"

export class AsyncMemo<K, V> {
  running = new Map<K, Promise<V>>()

  run(key: K, run: () => Promise<V>) {
    return getOrInit(this.running, key, () => run().finally(() => this.running.delete(key)))
  }
}

export class TimedMemo<K, V> extends AsyncMemo<K, V> {
  done = new Map<K, V>()

  constructor(readonly ttl: number) {
    super()
  }

  override async run(key: K, run: () => Promise<V>) {
    const existing = this.done.get(key)
    if (existing) return existing
    return super.run(key, () =>
      run().then((value) => {
        this.done.set(key, value)
        setTimeout(() => this.done.delete(key), this.ttl)
        return value
      }))
  }
}

export class WeakMemo<K, V extends object> extends AsyncMemo<K, V> {
  done = new Map<K, WeakRef<V>>()
  finReg = new FinalizationRegistry<K>((key) => this.done.delete(key))

  override async run(key: K, run: () => Promise<V>) {
    const existing = this.done.get(key)?.deref()
    if (existing) return existing
    return super.run(key, () =>
      run().then((value) => {
        this.done.set(key, new WeakRef(value))
        return value
      }))
  }
}
