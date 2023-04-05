import { Binary } from "./binary.ts"

export interface ProxyChain {
  url: string
  binary?: never
  version: string
}

export interface NetworkConfig {
  url?: never
  binary: Binary
  chain: string
  nodes?: number
  parachains?: Record<string, {
    binary: Binary
    chain: string
    id: number
    nodes?: number
  }>
}

export interface CapiConfig {
  server: string
  chains?: Record<string, ProxyChain | NetworkConfig>
}
