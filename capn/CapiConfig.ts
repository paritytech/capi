import { Binary } from "./binary.ts"

export interface ProxyChain {
  url: string
  binary?: never
  version: string
}

export interface BinaryChain {
  url?: never
  binary: Binary
  chain: string
}

export interface CapiConfig {
  server: string
  chains?: Record<string, ProxyChain | BinaryChain>
  networks?: Record<string, NetworkConfig>
}

export interface NetworkConfig {
  relay: BinaryChain & { nodes?: number }
  parachains: Record<string, BinaryChain & { id: number; nodes?: number }>
}
