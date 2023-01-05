import * as toml from "../../deps/std/encoding/toml.ts"
import { walk } from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"

export class LocalCompasses {
  chainSpecs: Record<string, string> = {}
  zombienetConfigs: Record<string, object> = {}

  constructor(readonly signal: AbortSignal) {}

  async start(): Promise<void> {
    const walker = walk(Deno.cwd(), {
      includeFiles: true,
      includeDirs: false,
      followSymlinks: false,
      exts: [".json", ".toml"],
    })
    const pending: Promise<void>[] = []
    for await (const entry of walker) {
      pending.push(this.#load(entry.path))
    }
    await Promise.all(pending)
    const watcher = Deno.watchFs(Deno.cwd())
    this.signal.addEventListener("abort", () => watcher.close())
    for await (const _event of watcher) {
      // TODO
    }
  }

  async #load(compassPath: string): Promise<void> {
    const contents = await Deno.readTextFile(compassPath)
    switch (path.extname(compassPath)) {
      case ".json": {
        const parsed = JSON.parse(contents)
        if ("chainType" in parsed && "bootNodes" in parsed && "genesis" in parsed) {
          this.chainSpecs[compassPath] = contents
        }
        break
      }
      case ".toml": {
        const parsed = toml.parse(contents)
        if ("relaychain" in parsed) {
          this.zombienetConfigs[compassPath] = parsed
        }
        break
      }
    }
  }
}
