import { LocalCodegenServer } from "../codegen/serve.ts"
import * as fs from "../deps/std/fs.ts"

const server = new AbortController()
await fs.emptyDir("target/codegen/generated")
const port = 5646
console.log(`http://localhost:${port}/`)
new LocalCodegenServer().listen(port, server.signal)

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

server.abort()
