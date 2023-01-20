import { client as kusama } from "kusama/client/raw.ts"
import { client as polkadot } from "polkadot/client/raw.ts"
import { client as rococo } from "rococo/client/raw.ts"
import { client as westend } from "westend/client/raw.ts"

const knownClients = { kusama, polkadot, westend, rococo }

const names = Object.keys(knownClients)
const outDir = new URL("../frame_metadata/_downloaded", import.meta.url)
try {
  Deno.removeSync(outDir, { recursive: true })
} catch (_e) {}
Deno.mkdirSync(outDir)

const modFilePath = new URL("_downloaded/mod.ts", outDir)
const modFileContents = `// This file was generated by \`_tasks/download_frame_metadata.ts\`
import * as U from "../../util/mod.ts"
import { $metadata } from "../mod.ts"

export const [
  ${names.join(",\n  ")},
] = await Promise.all([
  ${names.map((name) => `download("${name}")`).join(",\n  ")},
])

async function download(name: string) {
  return $metadata.decode(
    U.hex.decodeBuf((await Deno.readFile(new URL(\`./$\{name}.scale\`, import.meta.url))).slice(2)),
  )
}
`

Deno.writeTextFileSync(modFilePath, modFileContents, { create: true })

const pending: Promise<void>[] = []
for (const [name, client] of Object.entries(knownClients)) {
  pending.push((async () => {
    const r = await client.call(name, "state_getMetadata", [])
    if (r instanceof Error) throw r
    if (r.error) throw new Error(r.error.message)
    const outPath = new URL(`_downloaded/${name}.scale`, outDir)
    console.log(`Downloading ${name} metadata to "${outPath}".`)
    await Deno.writeTextFile(outPath, r.result)
    await client.discard()
  })())
}
await Promise.all(pending)
