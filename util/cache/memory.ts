import { PermanentMemo } from "../memo.ts"
import { CacheBase } from "./base.ts"

export class InMemoryCache extends CacheBase {
  memo = new PermanentMemo<string, Uint8Array>()
  _getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array> {
    return Promise.resolve(this.memo.run(key, init))
  }

  async _has(key: string): Promise<boolean> {
    return this.memo.done.has(key)
  }
}
