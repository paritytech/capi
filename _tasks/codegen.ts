import { FsCache } from "../codegen/cache.ts"
import { CodegenServer } from "../codegen/serve.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

const cacheDir = "target/codegen"
await fs.emptyDir(path.join(cacheDir, "generated"))
const cache = new FsCache(cacheDir)
const port = 5646
console.log(`http://localhost:${port}/`)
new CodegenServer(cache).listen(port)

await Deno.run({
  cmd: [
    "deno",
    "cache",
    "--import-map",
    "import_map_localhost.json",
    `--reload=http://localhost:${port}/`,
    "examples/mod.ts",
  ],
}).status()

Deno.exit(0)
