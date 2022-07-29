import { Config as Config_ } from "../config/mod.ts";
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

// TODO: attach type-level docs (draw from Substrate's source)
export type CallMethods = rpc.EnsureMethods<{
  account: {
    nextIndex: TODO_NARROW_METHOD_TYPE;
  };
  author: {
    hasKey(pubKey: string, keyType: string): string;
    hasSessionKeys: TODO_NARROW_METHOD_TYPE;
    insertKey: TODO_NARROW_METHOD_TYPE;
    pendingExtrinsics: TODO_NARROW_METHOD_TYPE;
    removeExtrinsics: TODO_NARROW_METHOD_TYPE;
    rotateKeys: TODO_NARROW_METHOD_TYPE;
    submitExtrinsic(transaction: U.HexString): U.HashHexString;
    unwatchExtrinsic(subscriptionId: U.SubscriptionIdString): unknown;
  };
  babe: {
    epochAuthorship: TODO_NARROW_METHOD_TYPE;
  };
  chain: {
    getBlock(hash?: U.HashHexString): T.Block;
    getBlockHash(height?: number): U.HashHexString;
    getFinalisedHead: CallMethods["chain_getFinalizedHead"];
    getFinalizedHead(): U.HashHexString;
    getHead: CallMethods["chain_getBlockHash"];
    getHeader(hash?: U.HashHexString): T.Header;
    getRuntimeVersion: CallMethods["state_getRuntimeVersion"];
    unsubscribeAllHeads(subscription: string): boolean;
    unsubscribeFinalisedHeads: CallMethods["chain_unsubscribeFinalizedHeads"];
    unsubscribeFinalizedHeads(subscription: string): boolean;
    unsubscribeNewHead: CallMethods["chain_unsubscribeNewHeads"];
    unsubscribeNewHeads(subscription: string): boolean;
    unsubscribeRuntimeVersion: CallMethods["state_unsubscribeRuntimeVersion"];
    unsubscribe_newHead: CallMethods["chain_unsubscribeNewHeads"];
  };
  chainHead: {
    unstable_body(followSubscription: U.HashHexString, networkConfig?: T.NetworkConfig): string;
    unstable_call(
      hash: U.HashHexString | undefined,
      fn: string,
      callParameters: U.HexString,
      networkConfig?: T.NetworkConfig,
    ): string;
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
  contracts: {
    getStorage(
      accountId: string, /* TODO: Ss58 requirement */
      key: U.HexString,
      hash?: U.HashHexString,
    ): unknown;
    // TODO
    call(...args: any[]): unknown;
    instantiate(...args: any[]): unknown;
    upload_code(...args: any[]): unknown;
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
    callAt: CallMethods["state_call"];
    getKeys: TODO_NARROW_METHOD_TYPE;
    getKeysPagedAt: CallMethods["state_getKeysPaged"];
    getMetadata(hash?: U.HashHexString): string;
    getPairs: TODO_NARROW_METHOD_TYPE;
    getReadProof: TODO_NARROW_METHOD_TYPE;
    getRuntimeVersion(at?: U.HashHexString): T.RuntimeVersion;
    getStorage(key: U.HexString, hash?: U.HashHexString): U.HexString;
    getStorageHash: TODO_NARROW_METHOD_TYPE;
    getStorageHashAt: CallMethods["state_getStorageHash"];
    getStorageSize: TODO_NARROW_METHOD_TYPE;
    getStorageSizeAt: CallMethods["state_getStorageSize"];
    queryStorage: TODO_NARROW_METHOD_TYPE;
    queryStorageAt(keys: U.HexString[], at?: U.HashHexString): T.StorageChangeSet;
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
    dryRunAt: CallMethods["system_dryRun"];
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
    unstable_unwatch(subscription: U.SubscriptionIdString): void;
  };
}>;

export type SubscriptionMethods = rpc.EnsureMethods<{
  author: {
    submitAndWatchExtrinsic(tx: U.HexString): T.TransactionStatus;
  };
  chain: {
    subscribeAllHeads(): T.Header;
    subscribeFinalisedHeads: SubscriptionMethods["chain_subscribeFinalizedHeads"];
    subscribeFinalizedHeads(): T.Header; /* TODO: narrow to finalized? */
    subscribeNewHead: SubscriptionMethods["chain_subscribeNewHeads"];
    subscribeNewHeads(): unknown;
    subscribeRuntimeVersion: SubscriptionMethods["state_subscribeRuntimeVersion"];
    subscribe_newHead: SubscriptionMethods["chain_subscribeNewHeads"];
  };
  chainHead: {
    unstable_follow(runtimeUpdates: boolean): T.ChainHeadUnstableFollowEvent;
  };
  state: {
    subscribeRuntimeVersion: TODO_NARROW_METHOD_TYPE;
    subscribeStorage(list: U.HexString[]): T.StorageNotification;
  };
  transaction: {
    unstable_submitAndWatch(transaction: U.HexString): unknown;
  };
}>;

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
