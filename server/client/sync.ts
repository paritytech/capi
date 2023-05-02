import { blake2_512, blake2_64, hex } from "../../crypto/mod.ts"
import { gray, green } from "../../deps/std/fmt/colors.ts"
import { Net } from "../../nets/mod.ts"
import { normalizePackageName, normalizeTypeName, withSignal } from "../../util/mod.ts"
import { $codegenSpec, CodegenEntryV0 } from "../CodegenSpec.ts"
import { upload } from "./upload.ts"

export async function sync(server: string, devnetTempDir: string, nets: Record<string, Net>) {
  return withSignal(async (signal) => {
    const netEntries = Object.entries(nets)
    let synced = 0
    const entries = await Promise.all(
      netEntries.map(async ([name, chain]): Promise<[string, CodegenEntryV0]> => {
        const packageName = normalizePackageName(name)
        const chainName = normalizeTypeName(name)
        const metadata = await chain.metadata(signal, devnetTempDir)
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
