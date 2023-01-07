import * as fs from "../deps/std/fs.ts"
import { polkadot } from "../frame_metadata/_downloaded/mod.ts"
import { codegen } from "./mod.ts"

const OUT_DIR = import.meta.resolve("./_tmp/")
// await fs.emptyDir(OUT_DIR)

const files = codegen({ metadata: polkadot })
for (const [name, contents] of files) {
  const url = new URL(`./${name}`, OUT_DIR)
  console.log(url.href)
}
