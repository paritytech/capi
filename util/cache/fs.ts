import * as fs from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"
import { CacheBase } from "./base.ts"

export class FsCache extends CacheBase {
  constructor(readonly location: string, signal: AbortSignal) {
    super(signal)
  }

  async _has(key: string) {
    const file = path.join(this.location, key)
    try {
      await Deno.lstat(file)
      return true
    } catch {
      return false
    }
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
