import * as $ from "../../deps/scale.ts"
import { getOrInit, TimedMemo, WeakMemo } from "../../util/mod.ts"

export abstract class Cache {
  constructor(readonly signal: AbortSignal) {
    this.stringMemo = new TimedMemo<string, string>(-1, this.signal)
  }

  abstract _getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array>

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

  abstract _list(prefix: string): Promise<string[]>

  listMemo = new WeakMemo<string, string[]>()
  list(prefix: string) {
    return this.listMemo.run(prefix, () => this._list(prefix))
  }
}
