import { Binary } from "./binary.ts"

export type NetConfig = WsNetConfig | DevNetConfig | RawMetadataNetConfig

export function wsNet(props: WsNetConfig) {
  return props
}
export interface WsNetConfig {
  url: string
  binary?: never
  metadata?: never

  version: string
}

export function devnet(props: DevNetConfig) {
  return props
}
export interface DevNetConfig {
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

export function rawNet(metadata: Uint8Array): RawMetadataNetConfig {
  return { metadata }
}
export interface RawMetadataNetConfig {
  url?: never
  binary?: never
  metadata: Uint8Array
}
