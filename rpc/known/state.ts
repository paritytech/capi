import { ReadProof, StorageData, StorageKey } from "./childstate.ts"
import { Hash, Hex, RpcResult, SerdeEnum, Subscription } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/01a3ad65/primitives/version/src/lib.rs#L161
/**
 * Runtime version.
 * This should not be thought of as classic Semver (major/minor/tiny).
 * This triplet have different semantics and mis-interpretation could cause problems.
 * In particular: bug fixes should result in an increment of `spec_version` and possibly
 * `authoring_version`, absolutely not `impl_version` since they change the semantics of the
 * runtime.
 */
export interface RuntimeVersion {
  /**
   * Identifies the different Substrate runtimes. There'll be at least polkadot and node.
   * A different on-chain spec_name to that of the native runtime would normally result
   * in node not attempting to sync or author blocks.
   */
  specName: string

  /**
   * Name of the implementation of the spec. This is of little consequence for the node
   * and serves only to differentiate code of different implementation teams. For this
   * codebase, it will be parity-polkadot. If there were a non-Rust implementation of the
   * Polkadot runtime (e.g. C++), then it would identify itself with an accordingly different
   * `impl_name`.
   */
  implName: string

  /**
   * `authoring_version` is the version of the authorship interface. An authoring node
   * will not attempt to author blocks unless this is equal to its native runtime.
   */
  authoringVersion: number

  /**
   * Version of the runtime specification. A full-node will not attempt to use its native
   * runtime in substitute for the on-chain Wasm runtime unless all of `spec_name`,
   * `spec_version` and `authoring_version` are the same between Wasm and native.
   */
  specVersion: number

  /**
   * Version of the implementation of the specification. Nodes are free to ignore this; it
   * serves only as an indication that the code is different; as long as the other two versions
   * are the same then while the actual code may be different, it is nonetheless required to
   * do the same thing.
   * Non-consensus-breaking optimizations are about the only changes that could be made which
   * would result in only the `impl_version` changing.
   */
  implVersion: number
  /** List of supported API "features" along with their versions. */
  apis: [Hash, Hex | undefined][]
  /**
   * All existing dispatches are fully compatible when this number doesn't change. If this
   * number changes, then `spec_version` must change, also.
   *
   * This number must change when an existing dispatchable (module ID, dispatch ID) is changed,
   * either through an alteration in its user-level semantics, a parameter
   * added/removed/changed, a dispatchable being removed, a module being removed, or a
   * dispatchable/module changing its index.
   *
   * It need *not* change when a new module is added or when a dispatchable is added.
   */
  transactionVersion: number
  /**
   * Version of the state implementation used by this runtime.
   * Use of an incorrect version is consensus breaking.
   */
  stateVersion: number
}

// https://github.com/paritytech/substrate/blob/4d04aba/primitives/storage/src/lib.rs#L181
/** Storage change set */
export interface StorageChangeSet {
  /** Block hash */
  block: Hash
  /** A list of changes */
  changes: [StorageKey, StorageData | null][]
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L96
/** Response for the `state_traceBlock` RPC. */
export type TraceBlockResponse = SerdeEnum<{
  /** Error block tracing response */
  traceError: TraceError
  /** Successful block tracing response */
  blockTrace: BlockTrace
}>

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L88
/** Error response for the `state_traceBlock` RPC. */
export interface TraceError {
  /** Error message */
  error: string
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L27
export interface BlockTrace {
  /** Hash of the block being traced */
  blockHash: Hash
  /** Parent hash */
  parentHash: Hash
  /**
   * Module targets that were recorded by the tracing subscriber.
   * Empty string means record all targets.
   */
  tracingTargets: string
  /**
   * Storage key targets used to filter out events that do not have one of the storage keys.
   * Empty string means do not filter out any events.
   */
  storage_keys: string
  /**
   * Method targets used to filter out events that do not have one of the event method.
   * Empty string means do not filter out any events.
   */
  methods: string
  /** Vec of tracing spans */
  spans: Span[]
  /** Vec of tracing events */
  events: Event[]
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L50
/** Represents a tracing event, complete with recorded data. */
export interface Event {
  /** Event target */
  target: string
  /** Associated data */
  data: Data
  /** Parent id, if it exists */
  parent_id?: number
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L80
/** Holds associated values for a tracing span. */
export interface Data {
  /** HashMap of `String` values recorded while tracing */
  stringValues: Record<string, string>
}

// https://github.com/paritytech/substrate/blob/ded44948/primitives/rpc/src/tracing.rs#L64
/**
 * Represents a single instance of a tracing span.
 *
 * Exiting a span does not imply that the span will not be re-entered.
 */
export interface Span {
  /** id for this span */
  id: number
  /** id of the parent span, if any */
  parentId?: number
  /** Name of this span */
  name: string
  /** Target, typically module */
  target: string
  /** Indicates if the span is from wasm */
  wasm: boolean
}

// https://github.com/paritytech/substrate/blob/28ac0a8/client/rpc-api/src/state/mod.rs#L35
export type StateRpc = {
  /** Call a contract at a block's state. */
  state_call(name: string, bytes: Hex, at?: Hash): RpcResult<Hex>
  state_callAt: StateRpc["state_call"]
  /**
   * Returns the keys with prefix, leave empty to get all the keys.
   * @deprecated [2.0.0] Please use `getKeysPaged` with proper paging support
   */
  state_getKeys(prefix: StorageKey, at?: Hash): RpcResult<StorageKey[]>
  /** Returns the keys with prefix, leave empty to get all the keys */
  state_getPairs(prefix: StorageKey, at?: Hash): RpcResult<[StorageKey, StorageData][]>
  /**
   * Returns the keys with prefix with pagination support.
   * Up to `count` keys will be returned.
   * If `start_key` is passed, return next keys in storage in lexicographic order.
   */
  state_getKeysPaged(
    prefix: StorageKey | null,
    count: number,
    startKey?: StorageKey,
    at?: Hash,
  ): RpcResult<StorageKey[]>
  state_getKeysPagedAt: StateRpc["state_getKeysPaged"]
  /** Returns a storage entry at a specific block's state. */
  state_getStorage(key: StorageKey, at?: Hash): RpcResult<StorageData | null>
  state_getStorageAt: StateRpc["state_getStorage"]
  /** Returns the hash of a storage entry at a block's state. */
  state_getStorageHash(key: StorageKey, at?: Hash): RpcResult<Hash | null>
  state_getStorageHashAt: StateRpc["state_getStorageHash"]
  /** Returns the size of a storage entry at a block's state. */
  state_getStorageSize(key: StorageKey, at?: Hash): RpcResult<number | null>
  state_getStorageSizeAt: StateRpc["state_getStorageSize"]
  /** Returns the runtime metadata as an opaque blob. */
  state_getMetadata(at?: Hash): RpcResult<Hex>
  /** Get the runtime version. */
  state_getRuntimeVersion(at?: Hash): RpcResult<RuntimeVersion>
  chain_getRuntimeVersion: StateRpc["state_getRuntimeVersion"]
  /**
   * Query historical storage entries (by key) starting from a block given as the second
   * parameter.
   *
   * NOTE This first returned result contains the initial state of storage for all keys.
   * Subsequent values in the vector represent changes to the previous state (diffs).
   */
  state_queryStorage(keys: StorageKey[], block: Hash, at?: Hash): RpcResult<StorageChangeSet[]>
  /** Query storage entries (by key) starting at block hash given as the second parameter. */
  state_queryStorageAt(keys: StorageKey[], at?: Hash): RpcResult<StorageChangeSet[]>
  /** Returns proof of storage entries at a specific block's state. */
  state_getReadProof(keys: StorageKey[], at?: Hash): RpcResult<ReadProof>
  /** New runtime version subscription */
  state_subscribeRuntimeVersion(): RpcResult<
    Subscription<"state_subscribeRuntimeVersion", RuntimeVersion>
  >
  state_unsubscribeRuntimeVersion(
    subscription: Subscription<"state_subscribeRuntimeVersion", RuntimeVersion>,
  ): RpcResult<void>
  chain_subscribeRuntimeVersion: StateRpc["state_subscribeRuntimeVersion"]
  chain_unsubscribeRuntimeVersion: StateRpc["state_unsubscribeRuntimeVersion"]
  /** New storage subscription */
  state_subscribeStorage(
    keys: StorageKey[] | null,
  ): RpcResult<Subscription<"state_subscribeStorage", StorageChangeSet>>
  state_unsubscribeStorage(
    subscription: Subscription<"state_subscribeStorage", StorageChangeSet>,
  ): RpcResult<void>
  /** See https://paritytech.github.io/substrate/master/sc_rpc_api/state/trait.StateApiServer.html#tymethod.trace_block */
  state_traceBlock(
    block: Hash,
    targets?: string,
    storageKeys?: string,
    methods?: string,
  ): RpcResult<TraceBlockResponse>
}
