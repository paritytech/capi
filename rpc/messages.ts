import { EnsureLookup } from "/util/mod.ts";
import * as T from "./types/mod.ts";

export type MethodName = keyof Lookup;

export type InitMessageByMethodName = { [N in MethodName]: InitMessageBase<N, Parameters<Lookup[N]>> };
export type InitMessage<N extends MethodName = MethodName> = InitMessageByMethodName[N];

export type OkMessageByMethodName = {
  [N in MethodName]: OkResBase<ReturnType<Lookup[N]> extends Subscription ? string : ReturnType<Lookup[N]>>;
};
export type OkMessage<N extends MethodName = MethodName> = OkMessageByMethodName[N];

export type NotifByMethodName = {
  [N in MethodName as ReturnType<Lookup[N]> extends Subscription ? N : never]: NotifMessageBase<
    N,
    ReturnType<Lookup[N]> extends Subscription<infer R> ? R : never
  >;
};
export type SubscriptionMethodName = keyof NotifByMethodName;
export type NotifMessage<N extends SubscriptionMethodName = SubscriptionMethodName> = NotifByMethodName[N];

// TODO: (possibly) narrow depending on method name
export type ErrMessage<N extends MethodName = MethodName> = ErrMessageBase<ErrorDetails>;

export type IngressMessage = OkMessage | ErrMessage | NotifMessage;

/**
 * The following is modeled closely after the method definitions of Smoldot. This `Lookup` type serves as a source of
 * truth, from which we map to init, notification and ok response types. Error types are––unfortunately––not defined as
 * method-specific on the Rust side, although perhaps we could create represent them as such.
 * @see https://github.com/paritytech/smoldot/blob/82836f4f2af4dd1716c57c14a4f591c7b1043950/src/json_rpc/methods.rs#L338-L479
 */
type Lookup = EnsureLookup<string, (...args: any[]) => any, {
  system_accountNextIndex(account: T.AccountId): number;
  account_nextIndex: TODO;
  system_dryRun: TODO;
  system_dryRunAt: Lookup["system_dryRun"];
  author_submitExtrinsic(transaction: T.HexString): T.HashHexString;
  author_insertKey: TODO;
  author_rotateKeys(): T.HexString;
  author_hasSessionKeys: TODO;
  author_hasKey(pubKey: string, keyType: string): string;
  author_pendingExtrinsics(): T.HexString[];
  author_removeExtrinsics: TODO;
  author_submitAndWatchExtrinsic(tx: string): Subscription<unknown>;
  author_unwatchExtrinsic(subscriptionId: T.SubscriptionId): unknown;
  babe_epochAuthorship(_: unknown): unknown;
  chain_getBlock(hash?: T.HashHexString): T.Block;
  chain_getBlockHash(height?: number): T.HashHexString;
  chain_getHead: Lookup["chain_getBlockHash"];
  chain_getFinalizedHead(): T.HashHexString;
  chain_getFinalisedHead: Lookup["chain_getFinalizedHead"];
  chain_getHeader(hash?: T.HashHexString): T.Header;
  chain_subscribeAllHeads(): Subscription<T.Header>;
  chain_subscribeFinalizedHeads(): Subscription<T.Header /* TODO: narrow to finalized? */>;
  chain_subscribeFinalisedHeads: Lookup["chain_subscribeFinalizedHeads"];
  chain_subscribeNewHeads(): Subscription<unknown>;
  subscribe_newHead: Lookup["chain_subscribeNewHeads"];
  chain_subscribeNewHead: Lookup["chain_subscribeNewHeads"];
  chain_unsubscribeAllHeads(subscription: string): boolean;
  chain_unsubscribeFinalizedHeads(subscription: string): boolean;
  chain_unsubscribeFinalisedHeads: Lookup["chain_unsubscribeFinalizedHeads"];
  chain_unsubscribeNewHeads(subscription: string): boolean;
  unsubscribe_newHead: Lookup["chain_unsubscribeNewHeads"];
  chain_unsubscribeNewHead: Lookup["chain_unsubscribeNewHeads"];
  chainHead_unstable_follow(runtimeUpdates: boolean): Subscription<T.ChainHeadUnstableFollowEvent>;
  childstate_getKeys: TODO;
  childstate_getStorage: TODO;
  childstate_getStorageHash: TODO;
  childstate_getStorageSize: TODO;
  grandpa_roundState: TODO;
  offchain_localStorageGet: TODO;
  offchain_localStorageSet: TODO;
  payment_queryInfo(extrinsic: T.HexString, hash?: T.HashHexString): T.RuntimeDispatchInfo;
  rpc_methods(): T.RpcMethods;
  state_call: TODO;
  state_callAt: Lookup["state_call"];
  state_getKeys: TODO;
  state_getKeysPaged(
    prefix: string | undefined,
    count: number,
    startKey?: T.HexString,
    hash?: T.HashHexString,
  ): T.HexString[];
  state_getKeysPagedAt: Lookup["state_getKeysPaged"];
  state_getMetadata(hash?: T.HashHexString): string;
  state_getPairs: TODO;
  state_getReadProof: TODO;
  state_getRuntimeVersion(at?: T.HashHexString): T.RuntimeVersion;
  chain_getRuntimeVersion: Lookup["state_getRuntimeVersion"];
  state_getStorage(key: T.HexString, hash?: T.HashHexString): T.HexString;
  state_getStorageHash: TODO;
  state_getStorageHashAt: Lookup["state_getStorageHash"];
  state_getStorageSize: TODO;
  state_getStorageSizeAt: Lookup["state_getStorageSize"];
  state_queryStorage: TODO;
  state_queryStorageAt(keys: T.HexString[], at?: T.HashHexString): T.StorageChangeSet;
  state_subscribeRuntimeVersion: TODO;
  chain_subscribeRuntimeVersion: Lookup["state_subscribeRuntimeVersion"];
  state_subscribeStorage(list: T.HexString[]): Subscription<"TODO">;
  state_unsubscribeRuntimeVersion(subscription: string): boolean;
  chain_unsubscribeRuntimeVersion: Lookup["state_unsubscribeRuntimeVersion"];
  state_unsubscribeStorage(subscription: string): boolean;
  system_addReservedPeer: TODO;
  system_chain(): string;
  system_chainType(): T.SystemChainTypeKind;
  system_health(): T.SystemHealth;
  system_localListenAddresses(): string[];
  system_localPeerId(): string;
  system_name(): string;
  system_networkState: TODO;
  system_nodeRoles: TODO;
  system_peers(): T.SystemPeer[];
  system_properties: TODO;
  system_removeReservedPeer: TODO;
  system_version(): string;
  chainHead_unstable_body(followSubscription: T.HashHexString, networkConfig?: T.NetworkConfig): string;
  chainHead_unstable_call(
    hash: T.HashHexString | undefined,
    fn: string,
    callParameters: T.HexString,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_genesisHash(): T.HashHexString;
  chainHead_unstable_header(followSubscription: string, hash: T.HashHexString): T.HexString | undefined;
  chainHead_unstable_stopBody(subscription: string): void;
  chainHead_unstable_stopCall(subscription: string): void;
  chainHead_unstable_stopStorage(subscription: string): void;
  chainHead_unstable_storage(
    follow_subscription: T.SubscriptionId,
    hash: T.HashHexString,
    key: T.HexString,
    childKey?: T.HexString,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_unfollow(followSubscription: T.SubscriptionId): void;
  chainHead_unstable_unpin(followSubscription: T.SubscriptionId, hash: T.HashHexString): void;
  chainSpec_unstable_chainName(): string;
  chainSpec_unstable_genesisHash(): string;
  chainSpec_unstable_properties(): unknown;
  sudo_unstable_p2pDiscover(multiaddr: T.MultiAddress): void;
  sudo_unstable_version(): string;
  transaction_unstable_submitAndWatch(transaction: T.HexString): T.SubscriptionId;
  transaction_unstable_unwatch(subscription: T.SubscriptionId): void;
}>;

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitMessageBase<Method extends MethodName, Params extends unknown[]> extends JsonRpcVersionBearer {
  method: Method;
  id: string;
  params: Params;
}

export interface OkResBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
  params?: never;
  error?: never;
}

export interface NotifMessageBase<Method extends MethodName, Result> extends JsonRpcVersionBearer {
  method: Method;
  id?: never;
  params: {
    subscription: T.SubscriptionId;
    result: Result;
  };
  result?: never;
  error?: never;
}

// TODO: narrow
export interface ErrorDetails {
  code: number;
  message: string;
}

export interface ErrMessageBase<Details extends ErrorDetails> extends JsonRpcVersionBearer {
  id: string;
  error: Details;
  params?: never;
  result?: never;
}

const _N: unique symbol = Symbol();
type Subscription<NotificationResult = any> = { [_N]: NotificationResult };

type TODO = (...args: unknown[]) => unknown;
