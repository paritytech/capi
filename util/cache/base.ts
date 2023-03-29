import * as $ from "../../deps/scale.ts"
import { AsyncMemo } from "../memo.ts"
import { getOrInit, TimedMemo, WeakMemo } from "../mod.ts"

export abstract class CacheBase {
  constructor(readonly signal: AbortSignal) {
    this.stringMemo = new TimedMemo<string, string>(-1, this.signal)
  }

  abstract _getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array>

  abstract _has(key: string): Promise<boolean>

  hasMemo = new AsyncMemo<string, boolean>()
  has(key: string) {
    return this.hasMemo.run(key, () => this._has(key))
  }

  rawMemo = new WeakMemo<string, Uint8Array>()
  getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array> {
    return this.rawMemo.run(key, () => this._getRaw(key, init))
  }

  decodedMemo = new Map<$.AnyCodec, WeakMemo<string, object>>()
  get<T extends object>(key: string, $value: $.Codec<T>, init: () => Promise<T>): Promise<T> {
    const memo = getOrInit(this.decodedMemo, $value, () => new WeakMemo()) as WeakMemo<string, T>
    return memo.run(key, async () => {
      let value: T | undefined
      const raw = await this.getRaw(key, async () => $value.encode(value = await init()))
      value ??= $value.decode(raw)
      return value
    })
  }

  stringMemo
  getString(key: string, ttl: number, init: () => Promise<string>): Promise<string> {
    return this.stringMemo.run(key, async () => {
      let value: string | undefined
      const raw = await this.getRaw(key, async () => new TextEncoder().encode(value = await init()))
      value ??= new TextDecoder().decode(raw)
      return value
    }, ttl)
  }
}
