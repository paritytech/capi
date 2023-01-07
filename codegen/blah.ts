import { tsFormatter } from "../deps/dprint.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import { polkadot } from "../frame_metadata/_downloaded/mod.ts"
import { codegen } from "./mod.ts"

const href = import.meta.resolve("../target/_tmp/")
const OUT_DIR = path.fromFileUrl(href)
await fs.emptyDir(OUT_DIR)

const files = codegen({
  metadata: polkadot,
  capi: "../../../mod.ts",
})
for (const [name, contents] of files) {
  const url = new URL(`./${name}`, href)
  ;(async () => {
    await fs.ensureFile(url.pathname)
    await Deno.writeTextFile(url, tsFormatter.formatText(name, contents))
  })()
}
