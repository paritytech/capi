export interface ChainSpec {
  bootNodes: string[]
  para_id?: number
  genesis: {
    runtime: GenesisConfig | { runtime_genesis_config: GenesisConfig }
  }
}

export interface GenesisConfig {
  runtime_genesis_config?: never
  paras: {
    paras: [[
      parachainId: number,
      genesis: [state: string, wasm: string, kind: boolean],
    ]]
  }
  parachainInfo: {
    parachainId: number
  }
  balances: {
    balances: [account: string, initialBalance: number][]
  }
  session?: {
    keys: [account: string, account: string, key: SessionKey][]
  }
  aura?: {
    authorities: string[]
  }
  grandpa?: {
    authorities: [string, 1][]
  }
  hrmp?: {
    preopenHrmpChannels: [
      senderParaId: number,
      recipientParaId: number,
      maxCapacity: number,
      maxMessageSize: number,
    ][]
  }
}

export interface SessionKey {
  grandpa: string
  babe: string
  im_online: string
  para_validator: string
  para_assignment: string
  authority_discovery: string
  beefy: string
}
