import * as fs from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"
import { Cache } from "./base.ts"

export class FsCache extends Cache {
  constructor(readonly location: string, signal: AbortSignal) {
    super(signal)
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

  async _list(prefix: string): Promise<string[]> {
    try {
      const result = []
      for await (const entry of Deno.readDir(path.join(this.location, prefix))) {
        result.push(entry.name)
      }
      return result
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return []
      }
      throw e
    }
  }
}
