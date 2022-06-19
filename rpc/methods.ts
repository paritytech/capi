import * as U from "../util/mod.ts";
import * as T from "./types/mod.ts";

// Swap with branded type
const _N: unique symbol = Symbol();
export type Subscription<NotificationResult = any> = { [_N]: NotificationResult };
type TODO_NARROW_METHOD_TYPE = (...args: unknown[]) => unknown;

// TODO: attach type-level docs (draw from Substrate's source)
/**
 * The following is modeled closely after the method definitions of Smoldot. This `Lookup` type serves as a source of
 * truth, from which we map to init, notification and ok response types. Error types are––unfortunately––not defined as
 * method-specific on the Rust side, although perhaps we could create represent them as such.
 *
 * @see https://github.com/paritytech/smoldot/blob/82836f4f2af4dd1716c57c14a4f591c7b1043950/src/json_rpc/methods.rs#L338-L479
 */
export type Methods = Lookup<{
  account: {
    nextIndex: TODO_NARROW_METHOD_TYPE;
  };
  author: {
    hasKey(pubKey: string, keyType: string): string;
    hasSessionKeys: TODO_NARROW_METHOD_TYPE;
    insertKey: TODO_NARROW_METHOD_TYPE;
    pendingExtrinsics(): U.HexString[];
    removeExtrinsics: TODO_NARROW_METHOD_TYPE;
    rotateKeys(): U.HexString;
    submitAndWatchExtrinsic(tx: string): Subscription<unknown>;
    submitExtrinsic(transaction: U.HexString): U.HashHexString;
    unwatchExtrinsic(subscriptionId: U.SubscriptionIdString): unknown;
  };
  babe: {
    epochAuthorship(_: unknown): unknown;
  };
  chain: {
    getBlock(hash?: U.HashHexString): T.Block;
    getBlockHash(height?: number): U.HashHexString;
    getFinalisedHead: Methods["chain_getFinalizedHead"];
    getFinalizedHead(): U.HashHexString;
    getHead: Methods["chain_getBlockHash"];
    getHeader(hash?: U.HashHexString): T.Header;
    getRuntimeVersion: Methods["state_getRuntimeVersion"];
    subscribeAllHeads(): Subscription<T.Header>;
    subscribeFinalisedHeads: Methods["chain_subscribeFinalizedHeads"];
    subscribeFinalizedHeads(): Subscription<T.Header /* TODO: narrow to finalized? */>;
    subscribeNewHead: Methods["chain_subscribeNewHeads"];
    subscribeNewHeads(): Subscription<unknown>;
    subscribeRuntimeVersion: Methods["state_subscribeRuntimeVersion"];
    subscribe_newHead: Methods["chain_subscribeNewHeads"];
    unsubscribeAllHeads(subscription: string): boolean;
    unsubscribeFinalisedHeads: Methods["chain_unsubscribeFinalizedHeads"];
    unsubscribeFinalizedHeads(subscription: string): boolean;
    unsubscribeNewHead: Methods["chain_unsubscribeNewHeads"];
    unsubscribeNewHeads(subscription: string): boolean;
    unsubscribeRuntimeVersion: Methods["state_unsubscribeRuntimeVersion"];
    unsubscribe_newHead: Methods["chain_unsubscribeNewHeads"];
  };
  chainHead: {
    unstable_body(followSubscription: U.HashHexString, networkConfig?: T.NetworkConfig): string;
    unstable_call(
      hash: U.HashHexString | undefined,
      fn: string,
      callParameters: U.HexString,
      networkConfig?: T.NetworkConfig,
    ): string;
    unstable_follow(runtimeUpdates: boolean): Subscription<T.ChainHeadUnstableFollowEvent>;
    unstable_genesisHash(): U.HashHexString;
    unstable_header(followSubscription: string, hash: U.HashHexString): U.HexString | undefined;
    unstable_stopBody(subscription: string): void;
    unstable_stopCall(subscription: string): void;
    unstable_stopStorage(subscription: string): void;
    unstable_storage(
      follow_subscription: U.SubscriptionIdString,
      hash: U.HashHexString,
      key: U.HexString,
      childKey?: U.HexString,
      networkConfig?: T.NetworkConfig,
    ): string;
    unstable_unfollow(followSubscription: U.SubscriptionIdString): void;
    unstable_unpin(followSubscription: U.SubscriptionIdString, hash: U.HashHexString): void;
  };
  childState: {
    getKeys: TODO_NARROW_METHOD_TYPE;
    getStorage: TODO_NARROW_METHOD_TYPE;
    getStorageHash: TODO_NARROW_METHOD_TYPE;
    getStorageSize: TODO_NARROW_METHOD_TYPE;
  };
  chainSpec: {
    unstable_chainName(): string;
    unstable_genesisHash(): string;
    unstable_properties(): unknown;
  };
  grandpa: {
    roundState: TODO_NARROW_METHOD_TYPE;
  };
  offchain: {
    localStorageGet: TODO_NARROW_METHOD_TYPE;
    localStorageSet: TODO_NARROW_METHOD_TYPE;
  };
  payment: {
    queryInfo(extrinsic: U.HexString, hash?: U.HashHexString): T.RuntimeDispatchInfo;
  };
  rpc: {
    methods(): T.RpcMethods;
  };
  state: {
    call: TODO_NARROW_METHOD_TYPE;
    callAt: Methods["state_call"];
    getKeys: TODO_NARROW_METHOD_TYPE;
    getKeysPagedAt: Methods["state_getKeysPaged"];
    getMetadata(hash?: U.HashHexString): string;
    getPairs: TODO_NARROW_METHOD_TYPE;
    getReadProof: TODO_NARROW_METHOD_TYPE;
    getRuntimeVersion(at?: U.HashHexString): T.RuntimeVersion;
    getStorage(key: U.HexString, hash?: U.HashHexString): U.HexString;
    getStorageHash: TODO_NARROW_METHOD_TYPE;
    getStorageHashAt: Methods["state_getStorageHash"];
    getStorageSize: TODO_NARROW_METHOD_TYPE;
    getStorageSizeAt: Methods["state_getStorageSize"];
    queryStorage: TODO_NARROW_METHOD_TYPE;
    queryStorageAt(keys: U.HexString[], at?: U.HashHexString): T.StorageChangeSet;
    subscribeRuntimeVersion: TODO_NARROW_METHOD_TYPE;
    subscribeStorage(list: U.HexString[]): Subscription<"TODO">;
    unsubscribeRuntimeVersion(subscription: string): boolean;
    unsubscribeStorage(subscription: string): boolean;
    getKeysPaged(
      prefix: string | undefined,
      count: number,
      startKey?: U.HexString,
      hash?: U.HashHexString,
    ): U.HexString[];
  };
  sudo: {
    unstable_p2pDiscover(multiaddr: U.MultiAddressString): void;
    unstable_version(): string;
  };
  system: {
    accountNextIndex(account: U.AccountIdString): number;
    addReservedPeer: TODO_NARROW_METHOD_TYPE;
    chain(): string;
    chainType(): T.SystemChainTypeKind;
    dryRun: TODO_NARROW_METHOD_TYPE;
    dryRunAt: Methods["system_dryRun"];
    health(): T.SystemHealth;
    localListenAddresses(): string[];
    localPeerId(): string;
    name(): string;
    networkState: TODO_NARROW_METHOD_TYPE;
    nodeRoles: TODO_NARROW_METHOD_TYPE;
    peers(): T.SystemPeer[];
    properties: TODO_NARROW_METHOD_TYPE;
    removeReservedPeer: TODO_NARROW_METHOD_TYPE;
    version(): string;
  };
  transaction: {
    unstable_submitAndWatch(transaction: U.HexString): U.SubscriptionIdString;
    unstable_unwatch(subscription: U.SubscriptionIdString): void;
  };
}>;

type Lookup<Lookup extends Record<string, Record<string, (...args: any[]) => any>>> = U.U2I<
  {
    [Prefix in keyof Lookup]: {
      [M in keyof Lookup[Prefix] as `${Extract<Prefix, string>}_${Extract<M, string>}`]:
        Lookup[Prefix][M];
    };
  }[keyof Lookup]
>;
