import { blake2_512, blake2_64, Hasher } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { gray, green } from "../deps/std/fmt/colors.ts"
import { $codegenSpec, CodegenEntryV0 } from "../server/codegenSpec.ts"
import { normalizePackageName, withSignal } from "../util/mod.ts"
import { normalizeTypeName } from "../util/normalize.ts"
import { Net } from "./Net.ts"

export async function syncConfig(tempDir: string, nets: Record<string, Net>, server: string) {
  return withSignal(async (signal) => {
    const netEntries = Object.entries(nets)
    let synced = 0
    const entries = await Promise.all(
      netEntries.map(async ([name, chain]): Promise<[string, CodegenEntryV0]> => {
        const packageName = normalizePackageName(name)
        const chainName = normalizeTypeName(name)
        const metadata = await chain.metadata(signal, tempDir)
        const metadataHash = await upload(server, "metadata", metadata, blake2_512)
        const progress = gray(`(${++synced}/${netEntries.length})`)
        console.log(green("Synced"), progress, `@capi/${packageName}`)
        const connection = chain.connection(name)
        return [packageName, { type: "frame", metadataHash, chainName, connection }]
      }),
    )
    const sortedEntries = new Map([...entries].sort((a, b) => a[0] < b[0] ? 1 : -1))
    const codegenSpec = $codegenSpec.encode({ type: "v0", codegen: sortedEntries })
    const codegenHash = hex.encode(await upload(server, "codegen", codegenSpec, blake2_64))
    return new URL(codegenHash + "/", server).toString()
  })
}

async function upload(server: string, kind: string, data: Uint8Array, hasher: Hasher) {
  const hash = hasher.hash(data)
  const url = new URL(`upload/${kind}/${hex.encode(hash)}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  if (exists.ok) return hash
  const response = await fetch(url, { method: "PUT", body: data })
  if (!response.ok) throw new Error(await response.text())
  return hash
}

export async function checkCodegenUploaded(server: string, hash: string) {
  const url = new URL(`upload/codegen/${hash}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  return exists.ok
}
