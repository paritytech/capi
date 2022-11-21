import { getModuleIndex, getSha } from "../codegen/server/git_utils.ts"
import { shaAbbrevLength } from "../codegen/server/prod.ts"
import { ensureDir } from "../deps/std/fs.ts"

const sha = await getSha()
const index = await getModuleIndex()

await ensureDir("target")
await Deno.writeTextFile(
  "target/deploy.ts",
  `
import { ProdCodegenServer } from "../codegen/server/prod.ts"

new ProdCodegenServer(
  "sha:${sha.slice(0, shaAbbrevLength)}",
  ${JSON.stringify(index)},
).listen(80)
`,
)
