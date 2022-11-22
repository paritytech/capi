import { getModuleIndex, getSha } from "../codegen/server/git_utils.ts"
import { ensureDir } from "../deps/std/fs.ts"

const sha = await getSha()
const index = await getModuleIndex()

await ensureDir("target")
await Deno.writeTextFile(
  "target/deploy.ts",
  `
import { DenoDeployCodegenServer } from "../codegen/server/deploy.ts"

new DenoDeployCodegenServer(
  "sha:${sha}",
  ${JSON.stringify(index)},
).listen(80)
`,
)
