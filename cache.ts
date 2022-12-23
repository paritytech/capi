import * as fs from "./deps/std/fs.ts"
import { LocalCapiCodegenServer } from "./server/local.ts"

await fs.emptyDir("target/codegen/generated")
const port = 5646
const server = new LocalCapiCodegenServer()
server.listen(port)

await Deno.run({
  cmd: [
    "deno",
    "cache",
    `--reload=http://localhost:${port}/`,
    ...Deno.args,
  ],
}).status()

server.abortController.abort()
