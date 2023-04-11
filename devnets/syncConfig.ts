export * from "./binary.ts"

import { blake2_512, blake2_64, Hasher } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import * as path from "../deps/std/path.ts"
import { WsConnection } from "../mod.ts"
import { $codegenSpec, CodegenEntry, CodegenSpec } from "../server/codegenSpec.ts"
import { normalizePackageName, withSignal } from "../util/mod.ts"
import { normalizeTypeName } from "../util/normalize.ts"
import { CapiConfig } from "./CapiConfig.ts"
import { startNetwork } from "./startNetwork.ts"

export async function syncConfig(tempDir: string, config: CapiConfig) {
  return withSignal(async (signal) => {
    const { server } = config
    const entries = new Map<string, CodegenEntry>()
    await Promise.all(
      Object.entries(config.chains ?? {}).map(async ([name, chain]) => {
        if (chain.url != null) {
          const metadata = await uploadMetadata(server, chain.url)
          entries.set(normalizePackageName(name), {
            type: "frame",
            metadata,
            chainName: normalizeTypeName(name),
            connection: { type: "WsConnection", discovery: chain.url },
          })
          return
        }
        const network = await startNetwork(path.join(tempDir, name), chain, signal)
        await Promise.all(
          [
            [undefined, network.relay] as const,
            ...Object.entries(network.paras),
          ].map(
            async ([paraName, chain]) => {
              const metadata = await uploadMetadata(
                server,
                `ws://127.0.0.1:${chain.ports[0]}`,
              )
              entries.set(
                normalizePackageName(name) + (paraName ? `/${normalizePackageName(paraName)}` : ""),
                {
                  type: "frame",
                  metadata: metadata,
                  chainName: normalizeTypeName(paraName ?? name),
                  connection: {
                    type: "DevnetConnection",
                    discovery: name + (paraName ? `/${paraName}` : ""),
                  },
                },
              )
            },
          ),
        )
      }),
    )
    const sortedEntries = new Map([...entries].sort((a, b) => a[0] < b[0] ? 1 : -1))
    const codegenHash = await uploadCodegenSpec(server, {
      type: "v0",
      codegen: sortedEntries,
    })
    return new URL(codegenHash + "/", server).toString()
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
