import { Binary } from "./binary.ts"

export interface Config {
  server: string
  chains?: Record<string, ChainConfig>
}

export type ChainConfig =
  | WsChainConfig
  | DevChainConfig
  | RawMetadataChainConfig

export interface WsChainConfig {
  url: string
  binary?: never
  metadata?: never

  version: string
}

export interface DevChainConfig {
  url?: never
  binary: Binary
  metadata?: never

  chain: string
  nodes?: number
  parachains?: Record<string, {
    binary: Binary
    chain: string
    id: number
    nodes?: number
  }>
}

export interface RawMetadataChainConfig {
  url?: never
  binary?: never
  metadata: Uint8Array
}
