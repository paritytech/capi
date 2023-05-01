import { BinaryGetter } from "./DevNet.ts"
import { DevRelayChain } from "./DevRelayChain.ts"
import { MetadataNet } from "./MetadataNet.ts"
import { WsNet } from "./WsNet.ts"

export namespace net {
  export function ws(url: string, version?: string) {
    return new WsNet(url, version)
  }

  export function metadata(metadata: Uint8Array) {
    return new MetadataNet(metadata)
  }

  export function dev(binary: BinaryGetter, chain: string, nodeCount?: number) {
    return new DevRelayChain(binary, chain, nodeCount)
  }
}

// moderate

export * from "./common/mod.ts"
export * from "./DevNet.ts"
export * from "./DevParachain.ts"
export * from "./DevRelayChain.ts"
export * from "./MetadataNet.ts"
export * from "./Net.ts"
export * from "./WsNet.ts"
