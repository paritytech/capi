import { ChainType } from "./system.ts"

// https://github.com/paritytech/substrate/blob/a7ba55d3/client/chain-spec/src/chain_spec.rs#L161
/** A configuration of a client. Does not include runtime storage initialization. */
export interface ChainSpec {
  // https://github.com/paritytech/substrate/blob/a7ba55d3/client/chain-spec/src/chain_spec.rs#L34
  genesis: GenesisSource
  name: string
  id: string
  chainType: ChainType
  bootNodes: string[]
  telemetryEndpoints: null | [string, number][]
  protocolId: null | string
  /**
   * Arbitrary string. Nodes will only synchronize with other nodes that have the same value
   * in their `fork_id`. This can be used in order to segregate nodes in cases when multiple
   * chains have the same genesis hash.
   */
  forkId?: string
  properties?: {
    ss58Format?: number
    tokenDecimals: number
    tokenSymbol: string
  }
  /**
   * Mapping from `block_number` to `wasm_code`.
   *
   * The given `wasm_code` will be used to substitute the on-chain wasm code starting with the
   * given block number until the `spec_version` on chain changes.
   */
  codeSubstitutes: Record<string, string>
  // Extensions, flattened into this structure by Serde: https://github.com/paritytech/substrate/blob/409167ef/bin/node/cli/src/chain_spec.rs#L55
  /** Block numbers with known hashes. */
  forkBlocks: null | string
  /** Known bad block hashes. */
  badBlocks: null | string[]
  /** The light sync state extension used by the sync-state rpc. */
  lightSyncState: LightSyncState
}

// https://github.com/paritytech/substrate/blob/a7ba55d3/client/chain-spec/src/chain_spec.rs#L34
export interface GenesisSource {
  raw: RawGenesis
}

// https://github.com/paritytech/substrate/blob/a7ba55d3/client/chain-spec/src/chain_spec.rs#L142
/** Raw storage content for genesis block. */
export interface RawGenesis {
  top: string[]
  childrenDefault: string[]
}

// https://github.com/paritytech/substrate/blob/eddf8883/client/sync-state-rpc/src/lib.rs#L111
export interface LightSyncState {
  /** The header of the best finalized block. */
  finalizedBlockHeader: string
  /** The epoch changes tree for babe. */
  babeEpochChanges: string
  /** The babe weight of the finalized block. */
  babeFinalizedBlockWeight: number
  /** The authority set for grandpa. */
  grandpaAuthoritySet: string
}

// https://github.com/paritytech/substrate/blob/eddf8883/client/sync-state-rpc/src/lib.rs#L128
export type SyncCalls = {
  // https://github.com/paritytech/substrate/blob/eddf8883/client/sync-state-rpc/src/lib.rs#L131
  /** Returns the JSON serialized chainspec running the node, with a sync state. */
  system_gen_sync_spec(raw: boolean): ChainSpec
}
