import { blake2_512, blake2_64, Hasher, hex } from "../../crypto/mod.ts"
import { gray, green } from "../../deps/std/fmt/colors.ts"
import { NetSpec } from "../../nets/mod.ts"
import { normalizePackageName, normalizeTypeName, withSignal } from "../../util/mod.ts"
import { $codegenSpec, CodegenEntry } from "../CodegenSpec.ts"

export async function syncNets(
  server: string,
  devnetTempDir: string,
  netSpecs: Record<string, NetSpec>,
) {
  return withSignal(async (signal) => {
    const netSpecsEntries = Object.entries(netSpecs)
    let synced = 0
    const entries = await Promise.all(
      netSpecsEntries.map(async ([name, netSpec]): Promise<[string, CodegenEntry]> => {
        const packageName = normalizePackageName(name)
        const chainName = normalizeTypeName(name)
        const metadata = await netSpec.metadata(signal, devnetTempDir)
        const metadataHash = await upload(server, "metadata", metadata, blake2_512)
        console.log(
          green("Synced"),
          gray(`(${++synced}/${netSpecsEntries.length})`),
          `@capi/${packageName}`,
        )
        const connection = netSpec.connection(name)
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
