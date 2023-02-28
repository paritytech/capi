import { SerdeEnum } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/57e3486/client/chain-spec/src/lib.rs#L198
/**
 * The type of a chain.
 *
 * This can be used by tools to determine the type of a chain for displaying
 * additional information or enabling additional features.
 */
export type ChainType = SerdeEnum<{
  /** A development chain that runs mainly on one node. */
  Development: void
  /** A local chain that runs locally on multiple nodes for testing purposes. */
  Local: void
  /** A live chain. */
  Live: void
  /** Some custom chain type. */
  Custom: string
}>

// https://github.com/paritytech/substrate/blob/c172d0f/client/rpc-api/src/system/helpers.rs#L43
/** Health struct returned by the RPC */
export interface Health {
  /** Number of connected peers */
  peers: number
  /** Is the node syncing */
  isSyncing: boolean
  /**
   * Should this node have any peers
   *
   * Might be false for local chains or when running without discovery.
   */
  shouldHavePeers: boolean
}

// https://github.com/paritytech/substrate/blob/c172d0f/client/rpc-api/src/system/helpers.rs#L63
/** Network Peer information */
export interface PeerInfo {
  /** Peer ID */
  peerId: string
  /** Roles */
  roles: string
  /** Peer best block hash */
  best_hash: string
  /** Peer best block number */
  best_number: number
}

// https://github.com/paritytech/substrate/blob/c172d0f/client/rpc-api/src/system/helpers.rs#L76
/** The role the node is running as */
export type NodeRole = SerdeEnum<{
  /** The node is a full node */
  Full: void
  /** The node is an authority */
  Authority: void
}>

// https://github.com/paritytech/substrate/blob/c172d0f/client/rpc-api/src/system/helpers.rs#L86
export interface SyncState {
  /** Height of the block at which syncing started. */
  startingBlock: number
  /** Height of the current best block of the node. */
  currentBlock: number
  /** Height of the highest block in the network. */
  highestBlock: number
}

// https://github.com/paritytech/substrate/blob/e0ccd00/client/rpc-api/src/system/mod.rs#L33
export type SystemCalls = {
  /** Get the node's implementation name. Plain old string. */
  system_name(): string
  /** Get the node implementation's version. Should be a semver string. */
  system_version(): string
  /** Get the chain's name. Given as a string identifier. */
  system_chain(): string
  /** Get the chain's type. */
  system_chainType(): ChainType
  /** Get a custom set of properties as a JSON object, defined in the chain spec. */
  system_properties(): Record<string, unknown>
  /**
   * Return health status of the node.
   *
   * Node is considered healthy if it is:
   * - connected to some peers (unless running in dev mode)
   * - not performing a major sync
   */
  system_health(): Health
  /** Returns the base58-encoded PeerId of the node. */
  system_localPeerId(): string
  /**
   * Returns the multi-addresses that the local node is listening on
   *
   * The addresses include a trailing `/p2p/` with the local PeerId, and are thus suitable to
   * be passed to `addReservedPeer` or as a bootnode address for example.
   */
  system_localListenAddresses(): string[]
  /** Returns currently connected peers */
  system_peers(): PeerInfo[]
  /**
   * Returns current state of the network.
   *
   * **Warning**: This API is not stable. Please do not programmatically interpret its output,
   * as its format might change at any time.
   */
  // TODO: the future of this call is uncertain: https://github.com/paritytech/substrate/issues/1890
  // https://github.com/paritytech/substrate/issues/5541
  system_networkState(): unknown
  /**
   * Adds a reserved peer. Returns the empty string or an error. The string
   * parameter should encode a `p2p` multiaddr.
   *
   * `/ip4/198.51.100.19/tcp/30333/p2p/QmSk5HQbn6LhUwDiNMseVUjuRYhEtYj4aUZ6WfWoGURpdV`
   * is an example of a valid, passing multiaddr with PeerId attached.
   */
  system_addReservedPeer(peer: string): void
  /**
   * Remove a reserved peer. Returns the empty string or an error. The string
   * should encode only the PeerId e.g. `QmSk5HQbn6LhUwDiNMseVUjuRYhEtYj4aUZ6WfWoGURpdV`.
   */
  system_removeReservedPeer(peerId: string): void
  /** Returns the list of reserved peers */
  system_reservedPeers(): string[]
  /** Returns the roles the node is running as. */
  system_nodeRoles(): NodeRole[]
  /**
   * Returns the state of the syncing of the node: starting block, current best block, highest
   * known block.
   */
  system_syncState(): SyncState
  /**
   * Adds the supplied directives to the current log filter
   *
   * The syntax is identical to the CLI `<target>=<level>`:
   *
   * `sync=debug,state=trace`
   */
  system_addLogFilter(directives: string): void
  /** Resets the log filter to Substrate defaults */
  system_resetLogFilter(): void
}
