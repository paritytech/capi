import * as fs from "../deps/std/fs.ts"
import { polkadot } from "../frame_metadata/_downloaded/mod.ts"
import { CodegenCtx, File } from "./mod.ts"

const clientFile = new File()
clientFile.code = `export const client = null!`

const ctx = new CodegenCtx({
  metadata: polkadot,
  capiUrl: new URL(import.meta.resolve("../mod.ts")),
  clientFile,
})

for (const [path_, code] of ctx) {
  const url = new URL(`./_gen/${path_}`, import.meta.url)
  fs.ensureFileSync(url.pathname)
  Deno.writeTextFileSync(url, code.code)
}
