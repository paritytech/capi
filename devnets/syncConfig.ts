export * from "./binary.ts"

import { blake2_512, blake2_64, Hasher } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { gray, green } from "../deps/std/fmt/colors.ts"
import * as path from "../deps/std/path.ts"
import { WsConnection } from "../mod.ts"
import { $codegenSpec, CodegenEntry, CodegenSpec } from "../server/codegenSpec.ts"
import { normalizePackageName, withSignal } from "../util/mod.ts"
import { normalizeTypeName } from "../util/normalize.ts"
import { NetConfig } from "./NetConfig.ts"
import { startNetworkForMetadata } from "./startNetwork.ts"

export async function syncConfig(
  tempDir: string,
  chains: Record<string, NetConfig>,
  server: string,
) {
  return withSignal(async (signal) => {
    const entries = new Map<string, CodegenEntry>()
    const chainConfigEntries = Object.entries(chains)
    const syncTotal = chainConfigEntries
      .map(([_, entry]) =>
        entry.binary && entry.parachains ? 1 + Object.values(entry.parachains).length : 1
      )
      .reduce((a, b) => a + b, 0)
    let synced = 0
    await Promise.all(
      chainConfigEntries.map(async ([name, chain]) => {
        const relayPackageName = normalizePackageName(name)
        if (chain.url != null) {
          const metadata = await uploadMetadata(server, chain.url)
          entries.set(relayPackageName, {
            type: "frame",
            metadata,
            chainName: normalizeTypeName(name),
            connection: { type: "WsConnection", discovery: chain.url },
          })
          logSynced(relayPackageName)
        } else if (chain.metadata) {
          const metadata = await _upload(server, "metadata", chain.metadata, blake2_512)
          entries.set(relayPackageName, {
            type: "frame",
            metadata,
            chainName: normalizeTypeName(name),
          })
          logSynced(relayPackageName)
        } else {
          const network = await startNetworkForMetadata(path.join(tempDir, name), chain, signal)
          await Promise.all(
            [[undefined, network.relay] as const, ...Object.entries(network.paras)].map(
              async ([paraName, chain]) => {
                const metadata = await uploadMetadata(server, `ws://127.0.0.1:${chain.ports[0]}`)
                const packageName = relayPackageName
                  + (paraName ? `/${normalizePackageName(paraName)}` : "")
                entries.set(packageName, {
                  type: "frame",
                  metadata: metadata,
                  chainName: normalizeTypeName(paraName ?? name),
                  connection: {
                    type: "DevnetConnection",
                    discovery: name + (paraName ? `/${paraName}` : ""),
                  },
                })
                logSynced(packageName)
              },
            ),
          )
        }
      }),
    )
    const sortedEntries = new Map([...entries].sort((a, b) => a[0] < b[0] ? 1 : -1))
    const codegenHash = await uploadCodegenSpec(server, {
      type: "v0",
      codegen: sortedEntries,
    })
    return new URL(codegenHash + "/", server).toString()

    function logSynced(packageName: string) {
      console.log(green("Synced"), gray(`(${++synced}/${syncTotal})`), `@capi/${packageName}`)
    }
  })
}

async function _upload(server: string, kind: string, data: Uint8Array, hasher: Hasher) {
  const hash = hasher.hash(data)
  const url = new URL(`upload/${kind}/${hex.encode(hash)}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  if (exists.ok) return hash
  const response = await fetch(url, { method: "PUT", body: data })
  if (!response.ok) throw new Error(await response.text())
  return hash
}

async function uploadMetadata(server: string, url: string) {
  const metadata = await withSignal(async (signal) => {
    const connection = WsConnection.connect(url, signal)
    const response = await connection.call("state_getMetadata", [])
    if (response.error) throw new Error("Error getting metadata")
    return hex.decode(response.result as string)
  })
  return await _upload(server, "metadata", metadata, blake2_512)
}

async function uploadCodegenSpec(server: string, spec: CodegenSpec) {
  return hex.encode(await _upload(server, "codegen", $codegenSpec.encode(spec), blake2_64))
}

export async function checkCodegenUploaded(server: string, hash: string) {
  const url = new URL(`upload/codegen/${hash}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  return exists.ok
}
