import { LocalCapiCodegenServer } from "../codegen/server/local.ts"
import * as fs from "../deps/std/fs.ts"

await fs.emptyDir("target/codegen/generated")
const port = 5646
const server = new LocalCapiCodegenServer()
server.listen(port)

await Deno.run({
  cmd: [
    "deno",
    "cache",
    "--no-lock",
    "--import-map",
    "import_map_localhost.json",
    `--reload=http://localhost:${port}/`,
    "examples/mod.ts",
  ],
}).status()

server.abortController.abort()
