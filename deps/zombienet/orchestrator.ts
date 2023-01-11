// https://github.com/paritytech/zombienet/blob/dfc5465a89c4c4f7caad5cf524facd8e57dcc4bc/javascript/packages/orchestrator/src/network.ts#L77
export interface Network {
  relay: NetworkNode[]
  paras: {
    [id: number]: {
      chainSpecPath?: string
      wasmPath?: string
      statePath?: string
      nodes: NetworkNode[]
    }
  }
  groups: { [id: string]: NetworkNode[] }
  companions: NetworkNode[]
  nodesByName: NodeMapping
  namespace: string
  client: Client
  launched: boolean
  wasRunning: boolean
  tmpDir: string
  backchannelUri: string
  chainSpecFullPath?: string
  tracing_collator_url?: string
  networkStartTime?: number
}

// https://github.com/paritytech/zombienet/blob/dfc5465a89c4c4f7caad5cf524facd8e57dcc4bc/javascript/packages/orchestrator/src/providers/client.ts#L16
export interface Client {
  namespace: string
  configPath: string
  debug: boolean
  timeout: number
  command: string
  tmpDir: string
  podMonitorAvailable: boolean
  localMagicFilepath: string
  providerName: string
  remoteDir: string | undefined
}

// https://github.com/paritytech/zombienet/blob/dfc5465a89c4c4f7caad5cf524facd8e57dcc4bc/javascript/packages/orchestrator/src/networkNode.ts#L32
export interface NetworkNode {
  name: string
  wsUri: string
  prometheusUri: string
  multiAddress: string
  spec?: object | undefined
  userDefinedTypes: any
  parachainId?: number
  lastLogLineCheckedTimestamp?: string
  lastLogLineCheckedIndex?: number
  group?: string
}

// https://github.com/paritytech/zombienet/blob/dfc5465a89c4c4f7caad5cf524facd8e57dcc4bc/javascript/packages/orchestrator/src/network.ts#L15
export interface NodeMapping {
  [propertyName: string]: NetworkNode
}
