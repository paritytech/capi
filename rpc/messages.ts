import {
  Block,
  Cow,
  Head,
  NetworkConfig,
  RuntimeVersion,
  StorageChangeSet,
  SystemHealth,
  SystemPeer,
} from "./common.ts";

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitBase<
  MethodName extends string,
  Params extends unknown[],
> extends JsonRpcVersionBearer {
  id: string;
  method: MethodName;
  params: Params;
}

export interface ResBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
}

export interface NotifBase<
  MethodName extends string,
  Result,
> extends JsonRpcVersionBearer {
  method: MethodName;
  params: {
    subscription: string;
    result: Result;
  };
}

export type Name = keyof Lookup;

export type InitByName = {
  [N in Name]: InitBase<N, Parameters<Lookup[N]>>;
};
export type GetInit<N extends Name> = InitByName[N];
export type Init = GetInit<Name>;

export type ResByName = {
  [N in Name]: ResBase<ReturnType<Lookup[N]> extends Subscription ? string : ReturnType<Lookup[N]>>;
};
export type GetRes<N extends Name> = ResByName[N];
export type Res = GetRes<Name>;

export type NotifByName = {
  [N in Name as ReturnType<Lookup[N]> extends Subscription ? N : never]: NotifBase<
    N,
    ReturnType<Lookup[N]> extends Subscription<infer R> ? R : never
  >;
};
export type SubscriptionName = keyof NotifByName;
export type GetNotif<N extends SubscriptionName> = NotifByName[N];
export type Notif = GetNotif<SubscriptionName>;

export type IngressMessage = Res | Notif;

type EnsureLookup<T extends Record<string, (...args: any[]) => any>> = T;

type Subscription<NotificationResult = any> = {
  notificationResult: NotificationResult;
};

// Modeled closely after https://github.com/paritytech/smoldot/blob/82836f4f2af4dd1716c57c14a4f591c7b1043950/src/json_rpc/methods.rs#L338-L479
export type Lookup = EnsureLookup<{
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
    block: Block;
    justifications: null; // TODO...
  };
  chain_getBlockHash(height?: number): string;
  chain_getHead: Lookup["chain_getBlockHash"];
  chain_getFinalizedHead: TODO;
  chain_getFinalisedHead: Lookup["chain_getFinalizedHead"];
  chain_getHeader: TODO;
  chain_subscribeAllHeads(): Subscription<Head>;
  chain_subscribeFinalizedHeads(): Subscription<Head /* TODO: narrow to finalized? */>;
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
  chainHead_unstable_follow(runtimeUpdates: boolean): Subscription<ChainHeadUnstableFollowEvent>;
  childstate_getKeys: TODO;
  childstate_getStorage: TODO;
  childstate_getStorageHash: TODO;
  childstate_getStorageSize: TODO;
  grandpa_roundState: TODO;
  offchain_localStorageGet: TODO;
  offchain_localStorageSet: TODO;
  payment_queryInfo(extrinsic: string, hash?: string): {
    weight: number;
    class: DispatchClassKind;
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
  state_getRuntimeVersion(at?: string): RuntimeVersion;
  chain_getRuntimeVersion: Lookup["state_getRuntimeVersion"];
  state_getStorage(key: string, blockHash?: string): string;
  state_getStorageHash: TODO;
  state_getStorageHashAt: Lookup["state_getStorageHash"];
  state_getStorageSize: TODO;
  state_getStorageSizeAt: Lookup["state_getStorageSize"];
  state_queryStorage: TODO;
  state_queryStorageAt(keys: string[], at?: string): StorageChangeSet;
  state_subscribeRuntimeVersion: TODO;
  chain_subscribeRuntimeVersion: Lookup["state_subscribeRuntimeVersion"];
  state_subscribeStorage(list: string[]): TODO;
  state_unsubscribeRuntimeVersion(subscription: string): boolean;
  chain_unsubscribeRuntimeVersion: Lookup["state_unsubscribeRuntimeVersion"];
  state_unsubscribeStorage(subscription: string): boolean;
  system_accountNextIndex(account: string): number;
  system_addReservedPeer: TODO;
  system_chain(): Cow;
  system_chainType(): SystemChainTypeKind;
  system_dryRun: TODO;
  system_dryRunAt: Lookup["system_dryRun"];
  system_health(): SystemHealth;
  system_localListenAddresses(): string[];
  system_localPeerId(): Cow;
  system_name(): Cow;
  system_networkState: TODO;
  system_nodeRoles: TODO;
  system_peers(): SystemPeer[];
  system_properties: TODO;
  system_removeReservedPeer: TODO;
  system_version(): Cow;
  chainHead_unstable_body(
    followSubscription: string,
    networkConfig?: NetworkConfig,
  ): Cow;
  chainHead_unstable_call(
    hash: string | undefined,
    fn: Cow,
    callParameters: string,
    networkConfig?: NetworkConfig,
  ): Cow;
  chainHead_unstable_genesisHash(): string;
  chainHead_unstable_header(
    followSubscription: Cow,
    hash: string,
  ): string | undefined;
  chainHead_unstable_stopBody(subscription: Cow): void;
  chainHead_unstable_stopCall(subscription: Cow): void;
  chainHead_unstable_stopStorage(subscription: Cow): void;
  chainHead_unstable_storage(
    hash: string,
    childKey?: string,
    networkConfig?: NetworkConfig,
  ): Cow;
  chainHead_unstable_unfollow(followSubscription: Cow): void;
  chainHead_unstable_unpin(
    followSubscription: Cow,
    hash: string,
  ): void;
  chainSpec_unstable_chainName(): Cow;
  chainSpec_unstable_genesisHash(): string;
  chainSpec_unstable_properties(): unknown;
  sudo_unstable_p2pDiscover(multiaddr: Cow): void;
  sudo_unstable_version(): Cow;
  transaction_unstable_submitAndWatch(transaction: string): Cow;
  transaction_unstable_unwatch(subscription: Cow): void;
}>;

type TODO = (...args: unknown[]) => unknown;

export type ChainHeadUnstableFollowEvent =
  | ChainHeadUnstableFollowInitializedEvent
  | ChainHeadUnstableFollowNewBlockEvent
  | ChainHeadUnstableFollowBestBlockChangedEvent
  | ChainHeadUnstableFollowFinalizedEvent
  | ChainHeadUnstableFollowStopEvent;
export type ChainHeadUnstableFollowEventKind =
  | "initialized"
  | "newBlock"
  | "bestBlockChanged"
  | "finalized"
  | "stop";
interface ChainHeadUnstableFollowEventBase<Kind extends ChainHeadUnstableFollowEventKind> {
  event: Kind;
}
export interface ChainHeadUnstableFollowInitializedEvent extends ChainHeadUnstableFollowEventBase<"initialized"> {
  finalizedBlockHash: string;
  finalizedBlockRuntime: string;
}
export interface ChainHeadUnstableFollowNewBlockEvent extends ChainHeadUnstableFollowEventBase<"newBlock"> {
  blockHash: string;
  parentBlockHash: string;
  newRuntime: null; // TODO
}
export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<"bestBlockChanged">
{
  bestBlockHash: string;
}
export interface ChainHeadUnstableFollowFinalizedEvent extends ChainHeadUnstableFollowEventBase<"finalized"> {
  finalizedBlocksHashes: string[];
  prunedBlocksHashes: string[];
}
export type ChainHeadUnstableFollowStopEvent = ChainHeadUnstableFollowEventBase<"stop">;

export const enum SystemChainTypeKind {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}

export const enum DispatchClassKind {
  Normal = "normal",
  Operational = "operational",
  Mandatory = "mandatory",
}
