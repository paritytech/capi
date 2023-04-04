export * from "./binary.ts"

import { blake2_512, blake2_64, Hasher } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { $codegenSpec, CodegenEntry, CodegenSpec } from "../server/codegenSpec.ts"
import { normalizePackageName, withSignal } from "../util/mod.ts"
import { CapiConfig } from "./CapiConfig.ts"
import { getBinaryMetadata, getUrlMetadata } from "./getMetadata.ts"
import { startNetwork } from "./startNetwork.ts"

export async function processConfig(config: CapiConfig) {
  return withSignal(async (signal) => {
    const { server } = config
    const entries = (await Promise.all([
      ...Object.entries(config.chains ?? {}).map(
        async ([name, chain]): Promise<[string[], CodegenEntry][]> => {
          const metadata = chain.url !== undefined
            ? await getUrlMetadata(chain, signal)
            : await getBinaryMetadata(chain, signal)
          const metadataHash = await uploadMetadata(server, metadata)
          return [[[normalizePackageName(name)], {
            type: "frame",
            metadata: metadataHash,
            chainName: name.replace(/^./, (x) => x.toUpperCase()),
            connection: chain.url !== undefined
              ? { type: "ws", discovery: chain.url }
              : { type: "capnChain", name },
          }]]
        },
      ),
      ...Object.entries(config.networks ?? {}).map(async ([networkName, network]) => {
        const chains = await startNetwork(network, signal)
        return await Promise.all(
          Object.entries(chains).map(
            async ([name, [port]]): Promise<[string[], CodegenEntry]> => {
              const metadata = await getUrlMetadata({ url: `ws://localhost:${port}` }, signal)
              const metadataHash = await uploadMetadata(server, metadata)
              return [[
                normalizePackageName(networkName),
                normalizePackageName(name),
              ], {
                type: "frame",
                metadata: metadataHash,
                chainName: name.replace(/^./, (x) => x.toUpperCase()),
                connection: { type: "capnNetworkChain", network: networkName, name },
              }]
            },
          ),
        )
      }),
    ])).flat()
    const codegenHash = await uploadCodegenSpec(server, {
      type: "v0",
      codegen: new Map(entries),
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

async function uploadMetadata(server: string, metadata: Uint8Array) {
  return await _upload(server, "metadata", metadata, blake2_512)
}

async function uploadCodegenSpec(server: string, spec: CodegenSpec) {
  return hex.encode(await _upload(server, "codegen", $codegenSpec.encode(spec), blake2_64))
}