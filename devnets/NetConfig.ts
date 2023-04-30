import { Binary } from "./binary.ts"

export type NetConfig = WsNetConfig | RelayChainConfig | ParachainConfig | MetadataNetConfig

export class WsNetConfig {
  binary?: never
  metadata?: never

  constructor(readonly url: string, readonly version: string) {}
}

export abstract class DevNetConfig {
  url?: never
  metadata?: never

  abstract binary: Binary
  abstract chain: string
  abstract nodes?: number
}

export class RelayChainConfig extends DevNetConfig {
  constructor(
    readonly binary: Binary,
    readonly chain: string,
    readonly nodes?: number,
    readonly parachains?: Record<string, ParachainConfig>,
  ) {
    super()
  }
}

export class ParachainConfig extends DevNetConfig {
  parachains?: never

  constructor(
    readonly binary: Binary,
    readonly chain: string,
    readonly id: number,
    readonly nodes?: number,
  ) {
    super()
  }
}

export interface MetadataNetConfig {
  url?: never
  binary?: never
  metadata: Uint8Array
}

export namespace net {
  export function fromWs(url: string, version = "latest") {
    return new WsNetConfig(url, version)
  }

  export function fromBin(
    binary: Binary,
    chain: string,
    nodes?: number,
    parachains?: Record<string, ParachainConfig>,
  ) {
    return new RelayChainConfig(binary, chain, nodes, parachains)
  }

  export function fromMetadata(metadata: Uint8Array): MetadataNetConfig {
    return { metadata }
  }
}
