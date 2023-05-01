import { Binary } from "./binary.ts"
import { MetadataNet } from "./MetadataNet.ts"
import { RelayChain } from "./RelayChain.ts"
import { WsNet } from "./WsNet.ts"

export namespace net {
  export function ws(url: string, version?: string) {
    return new WsNet(url, version)
  }

  export function metadata(metadata: Uint8Array) {
    return new MetadataNet(metadata)
  }

  export function dev(binary: Binary, chain: string, nodeCount?: number) {
    return new RelayChain(binary, chain, nodeCount)
  }
}
