import { ValueOf } from "/_/util/mod.ts";
import { AccountNextIndexInit, AccountNextIndexRes } from "./account/NextIndex.ts";
import { AuthorHasKeyInit, AuthorHasKeyRes } from "./author/HasKey.ts";
import { ChainGetBlockInit, ChainGetBlockRes } from "./chain/GetBlock.ts";
import { ChainGetBlockHashInit, ChainGetBlockHashRes } from "./chain/GetBlockHash.ts";
import {
  ChainSubscribeAllHeadsInit,
  ChainSubscribeAllHeadsNotif,
  ChainSubscribeAllHeadsRes,
} from "./chain/SubscribeAllHeads.ts";
import {
  ChainHeadUnstableFollowInit,
  ChainHeadUnstableFollowNotif,
  ChainHeadUnstableFollowRes,
} from "./chainHead/unstable/Follow.ts";
import { EnsureMethodLookup, MethodName, SubscriptionMethodName } from "./common.ts";
import { RpcMethodsInit, RpcMethodsRes } from "./rpc/Methods.ts";
import { StateGetMetadataInit, StateGetMetadataRes } from "./state/GetMetadata.ts";
import { StateGetStorageInit, StateGetStorageRes } from "./state/GetStorage.ts";
import { SystemChainTypeInit, SystemChainTypeRes } from "./system/ChainType.ts";
import { SystemHealthInit, SystemHealthRes } from "./system/Health.ts";

export * from "./chain/GetBlock.ts";
export * from "./chain/GetBlockHash.ts";
export * from "./chainHead/unstable/Follow.ts";
export * from "./common.ts";
export * from "./state/GetMetadata.ts";
export * from "./state/GetStorage.ts";
export * from "./system/ChainType.ts";
export * from "./system/Health.ts";

export type Init =
  | AccountNextIndexInit
  | AuthorHasKeyInit
  | ChainGetBlockInit
  | ChainGetBlockHashInit
  | ChainSubscribeAllHeadsInit
  | ChainHeadUnstableFollowInit
  | RpcMethodsInit
  | StateGetMetadataInit
  | StateGetStorageInit
  | SystemChainTypeInit
  | SystemHealthInit;

export type InitByName = {
  [N in MethodName]: Extract<Init, { method: N }>;
};

export type Res =
  | AccountNextIndexRes
  | ChainGetBlockRes
  | ChainGetBlockHashRes
  | ChainSubscribeAllHeadsRes
  | ChainHeadUnstableFollowRes
  | RpcMethodsRes
  | StateGetMetadataRes
  | StateGetStorageRes
  | SystemChainTypeRes
  | SystemHealthRes;

export type Notif = ChainHeadUnstableFollowNotif | ChainSubscribeAllHeadsNotif;

export type IngressMessage = Res | Notif;

export type ResByName = EnsureMethodLookup<Res, {
  account_nextIndex: AccountNextIndexRes;
  author_hasKey: AuthorHasKeyRes;
  chain_getBlock: ChainGetBlockRes;
  chain_getBlockHash: ChainGetBlockHashRes;
  chain_subscribeAllHeads: ChainSubscribeAllHeadsRes;
  chainHead_unstable_follow: ChainHeadUnstableFollowRes;
  rpc_methods: RpcMethodsRes;
  state_getMetadata: StateGetMetadataRes;
  state_getStorage: StateGetStorageRes;
  system_chainType: SystemChainTypeRes;
  system_health: SystemHealthRes;
}>;

export type NotifByName = {
  [N in SubscriptionMethodName]: Extract<Notif, { method: N }>;
};

export type InitBySubscriptionName = {
  [N in SubscriptionMethodName]: Extract<Init, { method: N }>;
};

export type SubscriptionInit = ValueOf<InitBySubscriptionName>;
