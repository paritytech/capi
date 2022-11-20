import { getModIndex } from "../codegen/server/getModIndex.ts"
import { ensureDir } from "../deps/std/fs.ts"

const sha = new TextDecoder().decode(
  await Deno.run({ cmd: ["git", "rev-parse", "@"], stdout: "piped" }).output(),
)

const shaAbbrevLength = 8
await ensureDir("target")
await Deno.writeTextFile(
  "target/deploy.ts",
  `
import { ProdCodegenServer } from "../codegen/server/prod.ts"

new ProdCodegenServer(
  "sha:${sha.slice(0, shaAbbrevLength)}",
  ${JSON.stringify(await getModIndex())},
).listen(80)
`,
)
