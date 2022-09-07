import { Config as Config_ } from "../config/mod.ts";
import { MultiAddress } from "../frame_metadata/Extrinsic.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import * as T from "./types/mod.ts";

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

type Hex = U.Hex;
type Hash = U.HexHash;
type SubId = string;
type AccId = string;
type StorageKey = Hex;

/// Holds information about the `slot`'s that can be claimed by a given key.
interface EpochAuthorship {
  /// the array of primary slots that can be claimed
  primary: number[];
  /// the array of secondary slots that can be claimed
  secondary: number[];
  /// The array of secondary VRF slots that can be claimed.
  secondary_vrf: number[];
}

type NumberOrHex = U.HexEncoded<bigint> | number;
type ListOrValue<T> = T | T[];

type Result<T> = T;
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

/** https://github.com/paritytech/substrate/blob/e0ccd00/client/rpc-api/src/author/mod.rs#L30 */
type AuthorRpc = {
  /** Submit hex-encoded extrinsic for inclusion in block. */
  author_submitExtrinsic(extrinsic: Hex): Result<Hash>;
  /** Insert a key into the keystore. */
  author_insertKey(keyType: string, suri: string, publicKey: Hex): Result<null>;
  /** Generate new session keys and returns the corresponding public keys. */
  author_rotateKeys(): Result<Hex>;
  /**
   * Checks if the keystore has private keys for the given session public keys.
   * `sessionKeys` is the SCALE encoded session keys object from the runtime.
   * Returns `true` iff all private keys could be found.
   */
  author_hasSessionKeys(sessionsKeys: Hex): Result<boolean>;
  /**
   * Checks if the keystore has private keys for the given public key and key type.
   * Returns `true` if a private key could be found.
   */
  author_hasKey(pubKey: Hex, keyType: string): Result<boolean>;
  /** Returns all pending extrinsics, potentially grouped by sender.  */
  author_pendingExtrinsics(): Result<Hex[]>;
  /** Remove given extrinsic from the pool and temporarily ban it to prevent reimporting. */
  author_removeExtrinsic(extrinsics: ExtrinsicOrHash[]): Result<Hex[]>; // todo
  /// Submit an extrinsic to watch.
  ///
  /// See [`TransactionStatus`](sc_transaction_pool_api::TransactionStatus) for details on
  /// transaction life cycle.
  author_submitAndWatchExtrinsic(
    extrinsic: Hex,
  ): Result<Subscription<"author_submitAndWatchExtrinsic", TransactionStatus>>;
  author_unwatchExtrinsic(
    subscription: Subscription<"author_submitAndWatchExtrinsic", TransactionStatus>,
  ): Result<void>;
};
/** https://github.com/paritytech/substrate/blob/9b01569/client/consensus/babe/rpc/src/lib.rs#L44 */
type BabeRpc = {
  /**
   * Returns data about which slots (primary or secondary) can be claimed in
   * the current epoch with the keys in the keystore.
   */
  babe_epochAuthorship(): Result<Record<AccId, EpochAuthorship>>;
};
/** https://github.com/paritytech/substrate/blob/317808a/client/beefy/rpc/src/lib.rs#L84 */
type BeefyRpc = {
  /// Returns the block most recently finalized by BEEFY, alongside side its justification.
  beefy_subscribeJustifications(): Result<
    Subscription<"beefy_subscribeJustifications", Notification>
  >;
  /// Returns hash of the latest BEEFY finalized block as seen by this client.
  ///
  /// The latest BEEFY block might not be available if the BEEFY gadget is not running
  /// in the network or if the client is still initializing or syncing with the network.
  /// In such case an error would be returned.
  beefy_getFinalizedHead(): Result<Hash>;
};
/** https://github.com/paritytech/substrate/blob/934fbfd/client/rpc-api/src/chain/mod.rs#L27 */
type ChainRpc = {
  /** Get header. */
  chain_getHeader(hash?: Hash): Result<T.Header | null>;
  /** Get header and body of a relay chain block. */
  chain_getBlock(hash?: Hash): Result<T.Block<U.Hex> | null>;
  /// Get hash of the n-th block in the canon chain.
  ///
  /// By default returns latest block hash.
  chain_getBlockHash(height?: ListOrValue<NumberOrHex>): Result<ListOrValue<Hash | null>>;
  chain_getHead: ChainRpc["chain_getBlockHash"];
  /// Get hash of the last finalized block in the canon chain.
  chain_getFinalizedHead(): Result<U.HexHash>;
  chain_getFinalisedHead: ChainRpc["chain_getFinalizedHead"];
  /// All head subscription.
  chain_subscribeAllHeads(): Result<Subscription<"chain_subscribeAllHeads", Header>>;
  chain_unsubscribeAllHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): Result<void>;
  /// All head subscription.
  chain_subscribeNewHeads(): Result<Subscription<"chain_subscribeAllHeads", Header>>;
  chain_unsubscribeNewHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): Result<void>;
  /// All head subscription.
  chain_subscribeFinalizedHeads(): Result<Subscription<"chain_subscribeAllHeads", Header>>;
  chain_unsubscribeFinalizedHeads(
    subscription: Subscription<"chain_subscribeAllHeads", Header>,
  ): Result<void>;
  chain_subscribeFinalisedHeads: ChainRpc["chain_subscribeFinalizedHeads"];
  chain_unsubscribeFinalisedHeads: ChainRpc["chain_unsubscribeFinalizedHeads"];
};
/** https://github.com/paritytech/substrate/blob/0246883/frame/contracts/rpc/src/lib.rs#L127 */
type X = {
  /// Executes a call to a contract.
  ///
  /// This call is performed locally without submitting any transactions. Thus executing this
  /// won't change any state. Nonetheless, the calling state-changing contracts is still possible.
  ///
  /// This method is useful for calling getter-like methods on contracts or to dry-run a
  /// a contract call in order to determine the `gas_limit`.
  contracts_call(
    callRequest: CallRequest,
    at?: BlockHash,
  ): Result<ContractExecResult>;
  /// Instantiate a new contract.
  ///
  /// This instantiate is performed locally without submitting any transactions. Thus the contract
  /// is not actually created.
  ///
  /// This method is useful for UIs to dry-run contract instantiations.
  contracts_instantiate(instantiateRequest: InstantiateRequest): Result<ContractInstantiateResult>;
  /// Upload new code without instantiating a contract from it.
  ///
  /// This upload is performed locally without submitting any transactions. Thus executing this
  /// won't change any state.
  ///
  /// This method is useful for UIs to dry-run code upload.
  contracts_upload_code(
    uploadRequest: CodeUploadRequest,
    at?: BlockHash,
  ): Result<CodeUploadRequest>;
  /// Returns the value under a specified storage `key` in a contract given by `address` param,
  /// or `None` if it is not set.
  contracts_getStorage(
    accountId: AccId,
    key: Hex,
    aat?: BlockHash,
  ): Result<Hex | null>;
};
/** https://github.com/paritytech/substrate/blob/934fbfd/client/rpc-api/src/child_state/mod.rs#L29 */
type ChildStateRpc = {
  /**
   * Returns the keys with prefix from a child storage, leave empty to get all the keys
   * @deprecated [2.0.0] Please use `getKeysPaged` with proper paging support
   */
  childState_getKeys(
    childStorageKey: PrefixedStorageKey,
    prefix: StorageKey,
    hash?: Hash,
  ): Result<StorageKey[]>;
  /// Returns the keys with prefix from a child storage with pagination support.
  /// Up to `count` keys will be returned.
  /// If `start_key` is passed, return next keys in storage in lexicographic order.
  childState_getKeysPaged(
    childStorageKey: PrefixedStorageKey,
    prefix: StorageKey,
    count: number,
    startKey?: StorageKey,
    hash?: Hash,
  ): TODO_NARROW_METHOD_TYPE;
  /// Returns a child storage entry at a specific block's state.
  childState_getStorage(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: Hash,
  ): Result<StorageData | null>;
  /// Returns child storage entries for multiple keys at a specific block's state.
  childState_getStorageEntries(
    childStorageKey: PrefixedStorageKey,
    keys: StorageKey[],
    hash?: Hash,
  ): Result<(StorageData | null)[]>;
  /// Returns the hash of a child storage entry at a block's state.
  childState_getStorageHash(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: Hash,
  ): Result<Hash | null>;
  /// Returns the size of a child storage entry at a block's state.
  childState_getStorageSize(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: Hash,
  ): Result<number | null>;
  /// Returns proof of storage for child key entries at a specific block's state.
  state_getChildReadProof(
    childStorageKey: PrefixedStorageKey,
    keys: StorageKey[],
    hash?: Hash,
  ): Result<ReadProof<Hash>>;
};

/** https://github.com/paritytech/substrate/blob/9b01569/client/finality-grandpa/rpc/src/lib.rs#L48 */
type GrandpaRpc = {
  /// Returns the state of the current best round state as well as the
  /// ongoing background rounds.
  grandpa_roundState(): Result<ReportedRoundStates>;
  /// Returns the block most recently finalized by Grandpa, alongside
  /// side its justification.
  grandpa_subscribeJustifications(): Result<
    Subscription<"grandpa_subscribeJustifications", Notification>
  >;
  grandpa_unsubscribeJustifications(
    subscription: Subscription<"grandpa_subscribeJustifications", Notification>,
  ): void;
  /// Prove finality for the given block number by returning the Justification for the last block
  /// in the set and all the intermediary headers to link them together.
  grandpa_proveFinality(block: number): Result<EncodedFinalityProof | null>;
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
  mmr_generateProof(leafIndex: LeafIndex, at?: BlockHash): Result<LeafProof>;
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
  mmr_generateBatchProof(leafIndices: LeafIndex[], at?: BlockHash): Result<LeafBatchProof>;
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
  payment_queryInfo(extrinsic: Hex, at?: BlockHash): T.RuntimeDispatchInfo;
  payment_queryFeeDetails(extrinsic: Hex, at?: BlockHash): FeeDetails<NumberOrHex>;
};
/** https://github.com/paritytech/substrate/blob/28ac0a8/client/rpc-api/src/state/mod.rs#L35 */
type StateRpc = {
  /// Call a contract at a block's state.
  state_call(name: string, bytes: Hex, at?: BlockHash): Result<Hex>;
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
