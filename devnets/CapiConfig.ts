import { Binary } from "./binary.ts"

export interface CapiConfig {
  server: string
  chains?: Record<string, Chain>
}

export type Chain = WsChainConfig | DevChainConfig | CustomChainConfig

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

export interface CustomChainConfig {
  url?: never
  binary?: never
  metadata: Uint8Array

  /** A JavaScript module which exports `connect` (of type `(signal: AbortSignal) => Connection`) */
  connect: URL
}
