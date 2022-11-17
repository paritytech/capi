import * as $ from "../deps/scale.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import { getOrInit, WeakMemo } from "../util/mod.ts"

export abstract class Cache {
  rawMemo = new WeakMemo<string, Uint8Array>()
  decodedMemo = new Map<$.AnyCodec, WeakMemo<string, object>>()
  abstract _getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array>

  getRaw(key: string, init: () => Promise<Uint8Array>): Promise<Uint8Array> {
    return this.rawMemo.run(key, () => this._getRaw(key, init))
  }

  get<T extends object>(key: string, $value: $.Codec<T>, init: () => Promise<T>): Promise<T> {
    const memo = getOrInit(this.decodedMemo, $value, () => new WeakMemo()) as WeakMemo<string, T>
    return memo.run(key, async () => {
      let value: T | undefined
      const raw = await this.getRaw(key, async () => $value.encode(value = await init()))
      value ??= $value.decode(raw)
      return value
    })
  }
}

export class FsCache extends Cache {
  constructor(readonly location: string) {
    super()
  }

  async _getRaw(key: string, init: () => Promise<Uint8Array>) {
    const file = path.join(this.location, key)
    try {
      return await Deno.readFile(file)
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) throw e
      const content = await init()
      await fs.ensureDir(path.dirname(file))
      await Deno.writeFile(file, content)
      return content
    }
  }
}
