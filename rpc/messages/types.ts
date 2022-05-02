import { ValueOf } from "/_/util/mod.ts";
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
import { EnsureMethodLookup, EnsureSubscriptionMethodLookup } from "./common.ts";
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
  | ChainGetBlockInit
  | ChainGetBlockHashInit
  | ChainSubscribeAllHeadsInit
  | ChainHeadUnstableFollowInit
  | StateGetMetadataInit
  | StateGetStorageInit
  | SystemChainTypeInit
  | SystemHealthInit;

export type InitByName = EnsureMethodLookup<Init, {
  chain_getBlock: ChainGetBlockInit;
  chain_getBlockHash: ChainGetBlockHashInit;
  chain_subscribeAllHeads: ChainSubscribeAllHeadsInit;
  chainHead_unstable_follow: ChainHeadUnstableFollowInit;
  state_getMetadata: StateGetMetadataInit;
  state_getStorage: StateGetStorageInit;
  system_chainType: SystemChainTypeInit;
  system_health: SystemHealthInit;
}>;

export type Res =
  | ChainGetBlockRes
  | ChainGetBlockHashRes
  | ChainSubscribeAllHeadsRes
  | ChainHeadUnstableFollowRes
  | StateGetMetadataRes
  | StateGetStorageRes
  | SystemChainTypeRes
  | SystemHealthRes;

export type Notif = ChainHeadUnstableFollowNotif | ChainSubscribeAllHeadsNotif;

export type IngressMessage = Res | Notif;

export type ResByName = EnsureMethodLookup<Res, {
  chain_getBlock: ChainGetBlockRes;
  chain_getBlockHash: ChainGetBlockHashRes;
  chain_subscribeAllHeads: ChainSubscribeAllHeadsRes;
  chainHead_unstable_follow: ChainHeadUnstableFollowRes;
  state_getMetadata: StateGetMetadataRes;
  state_getStorage: StateGetStorageRes;
  system_chainType: SystemChainTypeRes;
  system_health: SystemHealthRes;
}>;

export type NotifByName = EnsureSubscriptionMethodLookup<Notif, {
  chain_subscribeAllHeads: ChainHeadUnstableFollowNotif;
  chainHead_unstable_follow: ChainHeadUnstableFollowNotif;
}>;

export type InitBySubscriptionName = EnsureSubscriptionMethodLookup<Init, {
  chain_subscribeAllHeads: ChainSubscribeAllHeadsInit;
  chainHead_unstable_follow: ChainHeadUnstableFollowInit;
}>;

export type SubscriptionInit = ValueOf<InitBySubscriptionName>;
