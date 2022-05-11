import * as r from "./results/mod.ts";

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}
interface IdBearer {
  id: string;
}
interface MethodBearer<Method extends Name> {
  method: Method;
}

export interface InitBase<
  MethodName_ extends Name,
  Params extends unknown[],
> extends JsonRpcVersionBearer, IdBearer, MethodBearer<MethodName_> {
  params: Params;
}

export interface OkResBase<Result> extends JsonRpcVersionBearer, IdBearer {
  result: Result;
}

export interface NotifBase<
  Method extends Name,
  Result,
> extends JsonRpcVersionBearer, MethodBearer<Method> {
  params: {
    subscription: string;
    result: Result;
  };
}

// TODO: narrow
export interface ErrRes extends JsonRpcVersionBearer {
  id: string;
  error: {
    code: number;
    message: string;
  };
}

type EnsureMethodLookup<T extends Record<string, (...args: any[]) => any>> = T;

const _N: unique symbol = Symbol();
type Subscription<NotificationResult = any> = { [_N]: NotificationResult };

type TODO = (...args: unknown[]) => unknown;

// Modeled closely after https://github.com/paritytech/smoldot/blob/82836f4f2af4dd1716c57c14a4f591c7b1043950/src/json_rpc/methods.rs#L338-L479
export type Lookup = EnsureMethodLookup<{
  account_nextIndex: TODO;
  author_hasKey(pubKey: string, keyType: string): string;
  author_hasSessionKeys(): string;
  author_pendingExtrinsics(_: string): string;
  author_removeExtrinsics: TODO;
  author_rotateKeys(): string;
  author_submitAndWatchExtrinsic(tx: string): Subscription<unknown>;
  author_unwatchExtrinsic(subscription: string): unknown;
  babe_epochAuthorship(_: unknown): unknown;
  chain_getBlock(blockHash?: string): {
    block: r.Block;
    justifications: null; // TODO...
  };
  chain_getBlockHash(height?: number): string;
  chain_getHead: Lookup["chain_getBlockHash"];
  chain_getFinalizedHead: TODO;
  chain_getFinalisedHead: Lookup["chain_getFinalizedHead"];
  chain_getHeader: TODO;
  chain_subscribeAllHeads(): Subscription<r.Head>;
  chain_subscribeFinalizedHeads(): Subscription<r.Head /* TODO: narrow to finalized? */>;
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
  chainHead_unstable_follow(runtimeUpdates: boolean): Subscription<r.ChainHeadUnstableFollowEvent>;
  childstate_getKeys: TODO;
  childstate_getStorage: TODO;
  childstate_getStorageHash: TODO;
  childstate_getStorageSize: TODO;
  grandpa_roundState: TODO;
  offchain_localStorageGet: TODO;
  offchain_localStorageSet: TODO;
  payment_queryInfo(extrinsic: string, hash?: string): {
    weight: number;
    class: r.DispatchClassKind;
    partial_fee: number;
  };
  rpc_methods(): string[];
  state_call: TODO;
  state_callAt: Lookup["state_call"];
  state_getKeys: TODO;
  state_getKeysPaged(prefix: string | undefined, count: number, startKey?: string, hash?: string): string[];
  state_getKeysPagedAt: Lookup["state_getKeysPaged"];
  state_getMetadata(blockHash?: string): string;
  state_getPairs: TODO;
  state_getReadProof: TODO;
  state_getRuntimeVersion(at?: string): r.RuntimeVersion;
  chain_getRuntimeVersion: Lookup["state_getRuntimeVersion"];
  state_getStorage(
    key: string,
    blockHash?: string,
  ): string;
  state_getStorageHash: TODO;
  state_getStorageHashAt: Lookup["state_getStorageHash"];
  state_getStorageSize: TODO;
  state_getStorageSizeAt: Lookup["state_getStorageSize"];
  state_queryStorage: TODO;
  state_queryStorageAt(keys: string[], at?: string): r.StorageChangeSet;
  state_subscribeRuntimeVersion: TODO;
  chain_subscribeRuntimeVersion: Lookup["state_subscribeRuntimeVersion"];
  state_subscribeStorage(list: string[]): TODO;
  state_unsubscribeRuntimeVersion(subscription: string): boolean;
  chain_unsubscribeRuntimeVersion: Lookup["state_unsubscribeRuntimeVersion"];
  state_unsubscribeStorage(subscription: string): boolean;
  system_accountNextIndex(account: string): number;
  system_addReservedPeer: TODO;
  system_chain(): string;
  system_chainType(): r.SystemChainTypeKind;
  system_dryRun: TODO;
  system_dryRunAt: Lookup["system_dryRun"];
  system_health(): r.SystemHealth;
  system_localListenAddresses(): string[];
  system_localPeerId(): string;
  system_name(): string;
  system_networkState: TODO;
  system_nodeRoles: TODO;
  system_peers(): r.SystemPeer[];
  system_properties: TODO;
  system_removeReservedPeer: TODO;
  system_version(): string;
  chainHead_unstable_body(
    followSubscription: string,
    networkConfig?: r.NetworkConfig,
  ): string;
  chainHead_unstable_call(
    hash: string | undefined,
    fn: string,
    callParameters: string,
    networkConfig?: r.NetworkConfig,
  ): string;
  chainHead_unstable_genesisHash(): string;
  chainHead_unstable_header(
    followSubscription: string,
    hash: string,
  ): string | undefined;
  chainHead_unstable_stopBody(subscription: string): void;
  chainHead_unstable_stopCall(subscription: string): void;
  chainHead_unstable_stopStorage(subscription: string): void;
  chainHead_unstable_storage(
    hash: string,
    childKey?: string,
    networkConfig?: r.NetworkConfig,
  ): string;
  chainHead_unstable_unfollow(followSubscription: string): void;
  chainHead_unstable_unpin(
    followSubscription: string,
    hash: string,
  ): void;
  chainSpec_unstable_chainName(): string;
  chainSpec_unstable_genesisHash(): string;
  chainSpec_unstable_properties(): unknown;
  sudo_unstable_p2pDiscover(multiaddr: string): void;
  sudo_unstable_version(): string;
  transaction_unstable_submitAndWatch(transaction: string): string;
  transaction_unstable_unwatch(subscription: string): void;
}>;

// TODO: rename this
export type Name = keyof Lookup;

export type InitByName = { [N in Name]: InitBase<N, Parameters<Lookup[N]>> };
export type Init<N extends Name = Name> = InitByName[N];

export type OkResByName = {
  [N in Name]: OkResBase<ReturnType<Lookup[N]> extends Subscription ? string : ReturnType<Lookup[N]>>;
};
export type OkRes<N extends Name = Name> = OkResByName[N];

export type NotifByName = {
  [N in Name as ReturnType<Lookup[N]> extends Subscription ? N : never]: NotifBase<
    N,
    ReturnType<Lookup[N]> extends Subscription<infer R> ? R : never
  >;
};
export type SubscriptionName = keyof NotifByName;
export type Notif<N extends SubscriptionName = SubscriptionName> = NotifByName[N];

export type IngressMessage = OkRes | ErrRes | Notif;
