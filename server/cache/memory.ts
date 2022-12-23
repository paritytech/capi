import { PermanentMemo } from "../../util/mod.ts"
import { CacheBase } from "./base.ts"

export class InMemoryCache extends CacheBase {
  memo = new PermanentMemo<string, Uint8Array>()
  _getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array> {
    return Promise.resolve(this.memo.run(key, init))
  }
  _list(): Promise<string[]> {
    throw new Error("unimplemented")
  }
}
