export {}

// import { ensureDir } from "../deps/std/fs.ts"
// import { getModuleIndex, getSha } from "../server/git_utils.ts"

// const sha = await getSha()
// const index = await getModuleIndex()

// await ensureDir("target")
// await Deno.writeTextFile(
//   "target/deploy.ts",
//   `
// import { DenoDeployCodegenServer } from "../server/deploy.ts"

// new DenoDeployCodegenServer(
//   "sha:${sha}",
//   ${JSON.stringify(index)},
// ).listen(80)
// `,
// )
