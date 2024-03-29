// This task is used in CI to edit the import map to use capi.dev for codegen
// instead of the local server.

import { resolveNets } from "../cli/resolveNets.ts"
import { syncNets } from "../server/mod.ts"

const LOCAL_SERVER = "http://localhost:4646/"

const shaAbbrevLength = 8
const sha = Deno.env.get("CAPI_SHA")!.slice(0, shaAbbrevLength)

const capiServer = `https://capi.dev/@${sha}/`

const importMap = JSON.parse(await Deno.readTextFile("import_map.json"))
const oldCodegenUrl = importMap.imports["@capi/"]

if (!oldCodegenUrl.startsWith(LOCAL_SERVER)) {
  throw new Error("_tasks/use_remote.ts run twice")
}

const codegenUrl = capiServer + oldCodegenUrl.slice(LOCAL_SERVER.length)

console.log(codegenUrl)

importMap.imports["@capi/"] = codegenUrl
importMap.imports[`${capiServer}capi/`] = "./"

await Deno.writeTextFile("import_map.json", JSON.stringify(importMap, null, 2))

const codegenHash = oldCodegenUrl.slice(LOCAL_SERVER.length).split("/")[0]

if (await isUploaded(capiServer, codegenHash)) {
  console.log("codegen already uploaded")
} else {
  console.log("uploading codegen")
  await syncNets(capiServer, "target/capi", await resolveNets())
}

async function isUploaded(server: string, hash: string) {
  const url = new URL(`upload/codegen/${hash}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  return exists.ok
}
