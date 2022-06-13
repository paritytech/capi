import * as B from "../branded.ts";
import { EnsureLookup } from "../util/mod.ts";
import * as U from "../util/mod.ts";
import * as T from "./types/mod.ts";

export type MethodName = keyof MethodLookup;

export type InitMessageByMethodName = {
  [N in MethodName]: InitMessageBase<N, Parameters<MethodLookup[N]>>;
};
export type InitMessage<N extends MethodName = MethodName> = InitMessageByMethodName[N];

export type OkMessageByMethodName = {
  [N in MethodName]: OkResBase<
    ReturnType<MethodLookup[N]> extends Subscription ? string : ReturnType<MethodLookup[N]>
  >;
};
export type OkMessage<N extends MethodName = MethodName> = OkMessageByMethodName[N];

export type NotifByMethodName = {
  [N in MethodName as ReturnType<MethodLookup[N]> extends Subscription ? N : never]:
    NotifMessageBase<
      N,
      ReturnType<MethodLookup[N]> extends Subscription<infer R> ? R : never
    >;
};
export type SubscriptionMethodName = keyof NotifByMethodName;
export type NotifMessage<N extends SubscriptionMethodName = SubscriptionMethodName> =
  NotifByMethodName[N];

// TODO: error matching utility / requires generalized we think through generalized matching utility
// TODO: investigate whether it's worthwhile to support somehow tacking on narrow method-specific types
export type ErrName = keyof ErrDetailLookup;
export type ErrMessageByName = {
  [N in ErrName]: ErrorMessageBase<ErrDetailLookup[N][0], ErrDetailLookup[N][1]>;
};
export type ErrMessage<N extends ErrName = ErrName> = ErrMessageByName[N];

export type IngressMessage = OkMessage | ErrMessage | NotifMessage;

// TODO: attach type-level docs (draw from Substrate's source)
/**
 * The following is modeled closely after the method definitions of Smoldot. This `Lookup` type serves as a source of
 * truth, from which we map to init, notification and ok response types. Error types are––unfortunately––not defined as
 * method-specific on the Rust side, although perhaps we could create represent them as such.
 * @see https://github.com/paritytech/smoldot/blob/82836f4f2af4dd1716c57c14a4f591c7b1043950/src/json_rpc/methods.rs#L338-L479
 */
type MethodLookup = EnsureLookup<string, (...args: any[]) => any, {
  system_accountNextIndex(account: B.AccountIdString): number;
  account_nextIndex: TODO_NARROW_METHOD_TYPE;
  system_dryRun: TODO_NARROW_METHOD_TYPE;
  system_dryRunAt: MethodLookup["system_dryRun"];
  author_submitExtrinsic(transaction: B.HexString): B.HashHexString;
  author_insertKey: TODO_NARROW_METHOD_TYPE;
  author_rotateKeys(): B.HexString;
  author_hasSessionKeys: TODO_NARROW_METHOD_TYPE;
  author_hasKey(pubKey: string, keyType: string): string;
  author_pendingExtrinsics(): B.HexString[];
  author_removeExtrinsics: TODO_NARROW_METHOD_TYPE;
  author_submitAndWatchExtrinsic(tx: string): Subscription<unknown>;
  author_unwatchExtrinsic(subscriptionId: B.SubscriptionIdString): unknown;
  babe_epochAuthorship(_: unknown): unknown;
  chain_getBlock(hash?: B.HashHexString): T.Block;
  chain_getBlockHash(height?: number): B.HashHexString;
  chain_getHead: MethodLookup["chain_getBlockHash"];
  chain_getFinalizedHead(): B.HashHexString;
  chain_getFinalisedHead: MethodLookup["chain_getFinalizedHead"];
  chain_getHeader(hash?: B.HashHexString): T.Header;
  chain_subscribeAllHeads(): Subscription<T.Header>;
  chain_subscribeFinalizedHeads(): Subscription<T.Header /* TODO: narrow to finalized? */>;
  chain_subscribeFinalisedHeads: MethodLookup["chain_subscribeFinalizedHeads"];
  chain_subscribeNewHeads(): Subscription<unknown>;
  subscribe_newHead: MethodLookup["chain_subscribeNewHeads"];
  chain_subscribeNewHead: MethodLookup["chain_subscribeNewHeads"];
  chain_unsubscribeAllHeads(subscription: string): boolean;
  chain_unsubscribeFinalizedHeads(subscription: string): boolean;
  chain_unsubscribeFinalisedHeads: MethodLookup["chain_unsubscribeFinalizedHeads"];
  chain_unsubscribeNewHeads(subscription: string): boolean;
  unsubscribe_newHead: MethodLookup["chain_unsubscribeNewHeads"];
  chain_unsubscribeNewHead: MethodLookup["chain_unsubscribeNewHeads"];
  chainHead_unstable_follow(runtimeUpdates: boolean): Subscription<T.ChainHeadUnstableFollowEvent>;
  childstate_getKeys: TODO_NARROW_METHOD_TYPE;
  childstate_getStorage: TODO_NARROW_METHOD_TYPE;
  childstate_getStorageHash: TODO_NARROW_METHOD_TYPE;
  childstate_getStorageSize: TODO_NARROW_METHOD_TYPE;
  grandpa_roundState: TODO_NARROW_METHOD_TYPE;
  offchain_localStorageGet: TODO_NARROW_METHOD_TYPE;
  offchain_localStorageSet: TODO_NARROW_METHOD_TYPE;
  payment_queryInfo(extrinsic: B.HexString, hash?: B.HashHexString): T.RuntimeDispatchInfo;
  rpc_methods(): T.RpcMethods;
  state_call: TODO_NARROW_METHOD_TYPE;
  state_callAt: MethodLookup["state_call"];
  state_getKeys: TODO_NARROW_METHOD_TYPE;
  state_getKeysPaged(
    prefix: string | undefined,
    count: number,
    startKey?: B.HexString,
    hash?: B.HashHexString,
  ): B.HexString[];
  state_getKeysPagedAt: MethodLookup["state_getKeysPaged"];
  state_getMetadata(hash?: B.HashHexString): string;
  state_getPairs: TODO_NARROW_METHOD_TYPE;
  state_getReadProof: TODO_NARROW_METHOD_TYPE;
  state_getRuntimeVersion(at?: B.HashHexString): T.RuntimeVersion;
  chain_getRuntimeVersion: MethodLookup["state_getRuntimeVersion"];
  state_getStorage(key: B.HexString, hash?: B.HashHexString): B.HexString;
  state_getStorageHash: TODO_NARROW_METHOD_TYPE;
  state_getStorageHashAt: MethodLookup["state_getStorageHash"];
  state_getStorageSize: TODO_NARROW_METHOD_TYPE;
  state_getStorageSizeAt: MethodLookup["state_getStorageSize"];
  state_queryStorage: TODO_NARROW_METHOD_TYPE;
  state_queryStorageAt(keys: B.HexString[], at?: B.HashHexString): T.StorageChangeSet;
  state_subscribeRuntimeVersion: TODO_NARROW_METHOD_TYPE;
  chain_subscribeRuntimeVersion: MethodLookup["state_subscribeRuntimeVersion"];
  state_subscribeStorage(list: B.HexString[]): Subscription<"TODO">;
  state_unsubscribeRuntimeVersion(subscription: string): boolean;
  chain_unsubscribeRuntimeVersion: MethodLookup["state_unsubscribeRuntimeVersion"];
  state_unsubscribeStorage(subscription: string): boolean;
  system_addReservedPeer: TODO_NARROW_METHOD_TYPE;
  system_chain(): string;
  system_chainType(): T.SystemChainTypeKind;
  system_health(): T.SystemHealth;
  system_localListenAddresses(): string[];
  system_localPeerId(): string;
  system_name(): string;
  system_networkState: TODO_NARROW_METHOD_TYPE;
  system_nodeRoles: TODO_NARROW_METHOD_TYPE;
  system_peers(): T.SystemPeer[];
  system_properties: TODO_NARROW_METHOD_TYPE;
  system_removeReservedPeer: TODO_NARROW_METHOD_TYPE;
  system_version(): string;
  chainHead_unstable_body(
    followSubscription: B.HashHexString,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_call(
    hash: B.HashHexString | undefined,
    fn: string,
    callParameters: B.HexString,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_genesisHash(): B.HashHexString;
  chainHead_unstable_header(
    followSubscription: string,
    hash: B.HashHexString,
  ): B.HexString | undefined;
  chainHead_unstable_stopBody(subscription: string): void;
  chainHead_unstable_stopCall(subscription: string): void;
  chainHead_unstable_stopStorage(subscription: string): void;
  chainHead_unstable_storage(
    follow_subscription: B.SubscriptionIdString,
    hash: B.HashHexString,
    key: B.HexString,
    childKey?: B.HexString,
    networkConfig?: T.NetworkConfig,
  ): string;
  chainHead_unstable_unfollow(followSubscription: B.SubscriptionIdString): void;
  chainHead_unstable_unpin(followSubscription: B.SubscriptionIdString, hash: B.HashHexString): void;
  chainSpec_unstable_chainName(): string;
  chainSpec_unstable_genesisHash(): string;
  chainSpec_unstable_properties(): unknown;
  sudo_unstable_p2pDiscover(multiaddr: B.MultiAddressString): void;
  sudo_unstable_version(): string;
  transaction_unstable_submitAndWatch(transaction: B.HexString): B.SubscriptionIdString;
  transaction_unstable_unwatch(subscription: B.SubscriptionIdString): void;
}>;

type ErrDetailLookup = EnsureLookup<string, [code: number, data?: any], {
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

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitMessageBase<Method extends MethodName, Params extends unknown[]>
  extends JsonRpcVersionBearer
{
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
    subscription: B.SubscriptionIdString;
    result: Result;
  };
  result?: never;
  error?: never;
}

const _N: unique symbol = Symbol();
type Subscription<NotificationResult = any> = { [_N]: NotificationResult };
type TODO_NARROW_METHOD_TYPE = (...args: unknown[]) => unknown;

interface ErrorMessageBase<
  Code extends number,
  Data = undefined,
> extends JsonRpcVersionBearer {
  id: string;
  error:
    & {
      code: Code;
      message: string;
    }
    & (Data extends undefined ? {} : {
      data: Data;
    });
  params?: never;
  result?: never;
}
