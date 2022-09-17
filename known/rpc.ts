import { Config as Config_ } from "../config/mod.ts";
import { Expand } from "../deps/scale.ts";
import { MultiAddress } from "../frame_metadata/Extrinsic.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { Hash, Hex } from "../util/mod.ts";
import {
  AccId,
  ListOrValue,
  NumberOrHex,
  Result,
  StorageKey,
  SubId,
  Subscription,
} from "./rpc/utils.ts";
import * as T from "./types/mod.ts";
import { Header, RuntimeVersion, StorageChangeSet } from "./types/mod.ts";

export type Config<
  DiscoveryValue,
  CallMethodName extends keyof CallMethods,
  SubscriptionMethodName extends keyof SubscriptionMethods = never,
> = Config_<
  DiscoveryValue,
  Pick<CallMethods, CallMethodName>,
  Pick<SubscriptionMethods, SubscriptionMethodName>
>;

export type TODO_NARROW_METHOD_TYPE = (...args: any[]) => any;

export type Methods = CallMethods & SubscriptionMethods;

type TodoRpc = {
  state_getChildKeys: TODO_NARROW_METHOD_TYPE;
  state_getChildReadProof: TODO_NARROW_METHOD_TYPE;
  state_getChildStorage: TODO_NARROW_METHOD_TYPE;
  state_getChildStorageHash: TODO_NARROW_METHOD_TYPE;
  state_getChildStorageSize: TODO_NARROW_METHOD_TYPE;
  sudo_unstable_p2pDiscover(multiaddr: U.HexEncoded<MultiAddress>): void;
  sudo_unstable_version(): string;
  syncstate_genSyncSpec: TODO_NARROW_METHOD_TYPE;
  transaction_unstable_unwatch(subscription: SubId): void;
  chainHead_unstable_body(followSubscription: U.HexHash, networkConfig?: T.NetworkConfig): string;
  chainHead_unstable_call(
    hash: U.HexHash | null,
    fn: string,
    callParameters: U.Hex,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_genesisHash(): U.HexHash;
  chainHead_unstable_header(followSubscription: string, hash: U.HexHash): U.Hex | null;
  chainHead_unstable_stopBody(subscription: string): void;
  chainHead_unstable_stopCall(subscription: string): void;
  chainHead_unstable_stopStorage(subscription: string): void;
  chainHead_unstable_storage(
    follow_subscription: SubId,
    hash: U.HexHash,
    key: U.Hex,
    childKey?: U.Hex,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_unfollow(followSubscription: SubId): void;
  chainHead_unstable_unpin(followSubscription: SubId, hash: U.HexHash): void;
  chainSpec_unstable_chainName(): string;
  chainSpec_unstable_genesisHash(): string;
  chainSpec_unstable_properties(): unknown;
  chainSpec_getBlockStats(at: U.HexHash): T.BlockStats | null;
  chainSpec_createBlock: TODO_NARROW_METHOD_TYPE;
  chainSpec_finalizeBlock: TODO_NARROW_METHOD_TYPE;
  rpc_methods(): T.RpcMethods;
  // subscriptions
  chainHead_unstable_follow(runtimeUpdates: boolean): T.ChainHeadUnstableFollowEvent;
  transaction_unstable_submitAndWatch(transaction: U.Hex): unknown;
};

/** https://github.com/paritytech/substrate/blob/eddf888/frame/merkle-mountain-range/rpc/src/lib.rs#L99 */
type MMrRpc = {
  /// Generate MMR proof for given leaf index.
  ///
  /// This method calls into a runtime with MMR pallet included and attempts to generate
  /// MMR proof for leaf at given `leaf_index`.
  /// Optionally, a block hash at which the runtime should be queried can be specified.
  ///
  /// Returns the (full) leaf itself and a proof for this leaf (compact encoding, i.e. hash of
  /// the leaf). Both parameters are SCALE-encoded.
  mmr_generateProof(leafIndex: LeafIndex, at?: Hash): Result<LeafProof>;
  /// Generate MMR proof for the given leaf indices.
  ///
  /// This method calls into a runtime with MMR pallet included and attempts to generate
  /// MMR proof for a set of leaves at the given `leaf_indices`.
  /// Optionally, a block hash at which the runtime should be queried can be specified.
  ///
  /// Returns the leaves and a proof for these leaves (compact encoding, i.e. hash of
  /// the leaves). Both parameters are SCALE-encoded.
  /// The order of entries in the `leaves` field of the returned struct
  /// is the same as the order of the entries in `leaf_indices` supplied
  mmr_generateBatchProof(leafIndices: LeafIndex[], at?: Hash): Result<LeafBatchProof>;
};
/** https://github.com/paritytech/substrate/blob/7d233c2/client/rpc-api/src/offchain/mod.rs#L28 */
type OffchainRpc = {
  /// Set offchain local storage under given key and prefix.
  offchain_localStorageSet(kind: StorageKind, key: Hex, value: Hex): Result<null>;
  /// Get offchain local storage under given key and prefix.
  offchain_localStorageGet(kind: StorageKind, key: Hex): Result<Hex | null>;
};
/** https://github.com/paritytech/substrate/blob/eddf888/frame/transaction-payment/rpc/src/lib.rs#L41 */
type TransactionPaymentApi = {
  payment_queryInfo(extrinsic: Hex, at?: Hash): T.RuntimeDispatchInfo;
  payment_queryFeeDetails(extrinsic: Hex, at?: Hash): FeeDetails<NumberOrHex>;
};
/** https://github.com/paritytech/substrate/blob/28ac0a8/client/rpc-api/src/state/mod.rs#L35 */
type StateRpc = {
  /// Call a contract at a block's state.
  state_call(name: string, bytes: Hex, at?: Hash): Result<Hex>;
  state_callAt: StateRpc["state_call"];
  /**
   * Returns the keys with prefix, leave empty to get all the keys.
   * @deprecated [2.0.0] Please use `getKeysPaged` with proper paging support
   */
  state_getKeys(prefix: StorageKey, at?: Hash): Result<StorageKey[]>;
  /// Returns the keys with prefix, leave empty to get all the keys
  state_getPairs(prefix: StorageKey, at?: Hash): Result<[StorageKey, StorageData][]>;
  /// Returns the keys with prefix with pagination support.
  /// Up to `count` keys will be returned.
  /// If `start_key` is passed, return next keys in storage in lexicographic order.
  state_getKeysPaged(
    prefix: StorageKey | null,
    count: number,
    startKey?: StorageKey,
    at?: Hash,
  ): Result<StorageKey[]>;
  state_getKeysPagedAt: StateRpc["state_getKeysPaged"];
  /// Returns a storage entry at a specific block's state.
  state_getStorage(key: StorageKey, at?: Hash): Result<StorageData | null>;
  state_getStorageAt: StateRpc["state_getStorage"];
  /// Returns the hash of a storage entry at a block's state.
  state_getStorageHash(key: StorageKey, at?: Hash): Result<Hash | null>;
  state_getStorageHashAt: StateRpc["state_getStorageHash"];
  /// Returns the size of a storage entry at a block's state.
  state_getStorageSize(key: StorageKey, at?: Hash): Result<number | null>;
  state_getStorageSizeAt: StateRpc["state_getStorageSize"];
  /// Returns the runtime metadata as an opaque blob.
  state_getMetadata(at?: Hash): Result<Hex | null>;
  /// Get the runtime version.
  state_getRuntimeVersion(at?: Hash): Result<T.RuntimeVersion>;
  chain_getRuntimeVersion: StateRpc["state_getRuntimeVersion"];
  /// Query historical storage entries (by key) starting from a block given as the second
  /// parameter.
  ///
  /// NOTE This first returned result contains the initial state of storage for all keys.
  /// Subsequent values in the vector represent changes to the previous state (diffs).
  state_queryStorage(keys: StorageKey[], block: Hash, at?: Hash): Result<StorageChangeSet[]>;
  /// Query storage entries (by key) starting at block hash given as the second parameter.
  state_queryStorageAt(keys: StorageKey[], at?: Hash): Result<T.StorageChangeSet[]>;
  /// Returns proof of storage entries at a specific block's state.
  state_getReadProof(keys: StorageKey[], at?: Hash): Result<ReadProof>;
  /// New runtime version subscription
  state_subscribeRuntimeVersion(): Result<
    Subscription<"state_subscribeRuntimeVersion", RuntimeVersion>
  >;
  state_unsubscribeRuntimeVersion(
    subscription: Subscription<"state_subscribeRuntimeVersion", RuntimeVersion>,
  ): Result<void>;
  chain_subscribeRuntimeVersion: StateRpc["state_subscribeRuntimeVersion"];
  chain_unsubscribeRuntimeVersion: StateRpc["state_unsubscribeRuntimeVersion"];
  /// New storage subscription
  state_subscribeStorage(
    keys: StorageKey[] | null,
  ): Result<Subscription<"state_subscribeStorage", StorageChangeSet>>;
  state_unsubscribeStorage(
    subscription: Subscription<"state_subscribeStorage", StorageChangeSet>,
  ): Result<void>;
  /** See https://paritytech.github.io/substrate/master/sc_rpc_api/state/trait.StateApiServer.html#tymethod.trace_block */
  state_traceBlock(
    block: Hash,
    targets?: string,
    storageKeys?: string,
    methods?: string,
  ): Result<TraceBlockResponse>;
};
/** https://github.com/paritytech/substrate/blob/00cc5f1/utils/frame/rpc/state-trie-migration-rpc/src/lib.rs#L113 */
type StateMigrationRpc = {
  /// Check current migration state.
  ///
  /// This call is performed locally without submitting any transactions. Thus executing this
  /// won't change any state. Nonetheless it is a VERY costy call that should be
  /// only exposed to trusted peers.
  state_trieMigrationStatus(at?: Hash): Result<MigrationStatusResult>;
};

/** https://github.com/paritytech/substrate/blob/e0ccd00/client/rpc-api/src/system/mod.rs#L33 */
type SystemRpc = {
  /// Get the node's implementation name. Plain old string.
  system_name(): Result<string>;
  /// Get the node implementation's version. Should be a semver string.
  system_version(): Result<string>;
  /// Get the chain's name. Given as a string identifier.
  system_chain(): Result<string>;
  /// Get the chain's type.
  system_chainType(): Result<T.SystemChainTypeKind>;
  /// Get a custom set of properties as a JSON object, defined in the chain spec.
  system_properties(): Result<ChainSpecProperties>;
  /// Return health status of the node.
  ///
  /// Node is considered healthy if it is:
  /// - connected to some peers (unless running in dev mode)
  /// - not performing a major sync
  system_health(): T.SystemHealth;
  /// Returns the base58-encoded PeerId of the node.
  system_localPeerId(): Result<string>;
  /// Returns the multi-addresses that the local node is listening on
  ///
  /// The addresses include a trailing `/p2p/` with the local PeerId, and are thus suitable to
  /// be passed to `addReservedPeer` or as a bootnode address for example.
  system_localListenAddresses(): Result<string[]>;
  /// Returns currently connected peers
  system_peers(): Result<T.SystemPeer[]>;
  /// Returns current state of the network.
  ///
  /// **Warning**: This API is not stable. Please do not programmatically interpret its output,
  /// as its format might change at any time.
  // TODO: the future of this call is uncertain: https://github.com/paritytech/substrate/issues/1890
  // https://github.com/paritytech/substrate/issues/5541
  system_networkState(): Result<unknown>;
  /// Adds a reserved peer. Returns the empty string or an error. The string
  /// parameter should encode a `p2p` multiaddr.
  ///
  /// `/ip4/198.51.100.19/tcp/30333/p2p/QmSk5HQbn6LhUwDiNMseVUjuRYhEtYj4aUZ6WfWoGURpdV`
  /// is an example of a valid, passing multiaddr with PeerId attached.
  system_addReservedPeer(peer: string): Result<void>;
  /// Remove a reserved peer. Returns the empty string or an error. The string
  /// should encode only the PeerId e.g. `QmSk5HQbn6LhUwDiNMseVUjuRYhEtYj4aUZ6WfWoGURpdV`.
  system_removeReservedPeer(peerId: string): Result<void>;
  /// Returns the list of reserved peers
  system_reservedPeers(): Result<string[]>;
  /// Returns the roles the node is running as.
  system_nodeRoles(): Result<NodeRole[]>;
  /// Returns the state of the syncing of the node: starting block, current best block, highest
  /// known block.
  system_syncState(): Result<SyncState>;
  /// Adds the supplied directives to the current log filter
  ///
  /// The syntax is identical to the CLI `<target>=<level>`:
  ///
  /// `sync=debug,state=trace`
  system_addLogFilter(directives: string): Result<void>;
  /// Resets the log filter to Substrate defaults
  system_resetLogFilter(): Result<void>;
};

/** https://github.com/paritytech/substrate/blob/eddf888/utils/frame/rpc/system/src/lib.rs#L41 */
type FrameSystemRpc = {
  /// Returns the next valid index (aka nonce) for given account.
  ///
  /// This method takes into consideration all pending transactions
  /// currently in the pool and if no transactions are found in the pool
  /// it fallbacks to query the index from the runtime (aka. state nonce).
  system_accountNextIndex(account: AccountId): Result<number>;
  account_nextIndex: FrameSystemRpc["system_accountNextIndex"];
  /// Dry run an extrinsic at a given block. Return SCALE encoded ApplyExtrinsicResult.
  system_dryRun(extrinsic: Hex, at?: Hash): Result<Hex>;
  system_dryRunAt: FrameSystemRpc["system_dryRun"];
};

export type ErrorDetails = rpc.EnsureErrorDetails<{
  /**
   * Invalid JSON was received by the server.
   */
  ParseError: [-32700];
  /**
   * The JSON sent is not a valid Request object.
   */
  InvalidRequest: [-32600];
  /**
   * The method does not exist / is not available.
   */
  MethodNotFound: [-32601];
  /**
   * Invalid method parameter(s).
   */
  InvalidParams: [-32602];
  /**
   * Internal JSON-RPC error.
   */
  InternalError: [-32603];
  /**
   * Other internal server error.
   * Contains a more precise error code and a custom message.
   * Error code must be in the range -32000 to -32099 included.
   */
  ServerError: [number];
  /**
   * Method-specific error.
   * Contains a more precise error code and a custom message.
   * Error code must be outside of the range -32000 to -32700.
   */
  MethodError: [number];
}>;
