// This task is used in CI to edit the import map to use capi.dev for codegen
// instead of the local server.

import { config } from "../capi.config.ts"
import { checkCodegenUploaded, syncConfig } from "../devnets/mod.ts"

const shaAbbrevLength = 8
const sha = Deno.env.get("CAPI_SHA")!.slice(0, shaAbbrevLength)

const oldServer = config.server
const capiServer = `https://capi.dev/@${sha}/`
config.server = capiServer

const importMap = JSON.parse(await Deno.readTextFile("import_map.json"))
const oldCodegenUrl = importMap.imports["@capi/"]

if (!oldCodegenUrl.startsWith(oldServer)) {
  throw new Error("_tasks/use_remote.ts run twice")
}

const codegenUrl = capiServer + oldCodegenUrl.slice(oldServer.length)

console.log(codegenUrl)

importMap.imports["@capi/"] = codegenUrl
importMap.imports[`${capiServer}capi/`] = "./"

await Deno.writeTextFile("import_map.json", JSON.stringify(importMap, null, 2))

const codegenHash = oldCodegenUrl.slice(oldServer.length).split("/")[0]

if (await checkCodegenUploaded(capiServer, codegenHash)) {
  console.log("codegen already uploaded")
} else {
  console.log("uploading codegen")
  await syncConfig("target/capi", config)
}
