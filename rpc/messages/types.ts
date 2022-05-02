import { ValueOf } from "/_/util/mod.ts";
import { AccountNextIndexInit, AccountNextIndexRes } from "./account/NextIndex.ts";
import { AuthorHasKeyInit, AuthorHasKeyRes } from "./author/HasKey.ts";
import { AuthorHasSessionKeysInit, AuthorHasSessionKeysRes } from "./author/HasSessionKeys.ts";
import { AuthorPendingExtrinsicsInit, AuthorPendingExtrinsicsRes } from "./author/PendingExtrinsics.ts";
import { AuthorRemoveExtrinsicInit, AuthorRemoveExtrinsicRes } from "./author/RemoveExtrinsic.ts";
import { AuthorRotateKeysInit, AuthorRotateKeysRes } from "./author/RotateKeys.ts";
import {
  AuthorSubmitAndWatchExtrinsicInit,
  AuthorSubmitAndWatchExtrinsicNotif,
  AuthorSubmitAndWatchExtrinsicRes,
} from "./author/SubmitAndWatchExtrinsic.ts";
import { AuthorSubmitExtrinsicInit, AuthorSubmitExtrinsicRes } from "./author/SubmitExtrinsic.ts";
import { AuthorUnwatchExtrinsicInit, AuthorUnwatchExtrinsicRes } from "./author/UnwatchExtrinsic.ts";
import { BabeEpochAuthorshipInit, BabeEpochAuthorshipRes } from "./babe/EpochAuthorship.ts";
import { ChainGetBlockInit, ChainGetBlockRes } from "./chain/GetBlock.ts";
import { ChainGetBlockHashInit, ChainGetBlockHashRes } from "./chain/GetBlockHash.ts";
import { ChainGetFinalizedHeadInit, ChainGetFinalizedHeadRes } from "./chain/GetFinalizedHead.ts";
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

// TODO: re-export narrow RPC types
export * from "./common.ts";

export type Init =
  | AccountNextIndexInit
  | AuthorHasKeyInit
  | AuthorHasSessionKeysInit
  | AuthorPendingExtrinsicsInit
  | AuthorRemoveExtrinsicInit
  | AuthorRotateKeysInit
  | AuthorSubmitAndWatchExtrinsicInit
  | AuthorSubmitExtrinsicInit
  | AuthorUnwatchExtrinsicInit
  | BabeEpochAuthorshipInit
  | ChainGetBlockInit
  | ChainGetBlockHashInit
  | ChainGetFinalizedHeadInit
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
  | AuthorHasKeyRes
  | AuthorHasSessionKeysRes
  | AuthorPendingExtrinsicsRes
  | AuthorRemoveExtrinsicRes
  | AuthorRotateKeysRes
  | AuthorSubmitAndWatchExtrinsicRes
  | AuthorSubmitExtrinsicRes
  | AuthorUnwatchExtrinsicRes
  | BabeEpochAuthorshipRes
  | ChainGetBlockRes
  | ChainGetBlockHashRes
  | ChainGetFinalizedHeadRes
  | ChainSubscribeAllHeadsRes
  | ChainHeadUnstableFollowRes
  | RpcMethodsRes
  | StateGetMetadataRes
  | StateGetStorageRes
  | SystemChainTypeRes
  | SystemHealthRes;

export type Notif = AuthorSubmitAndWatchExtrinsicNotif | ChainHeadUnstableFollowNotif | ChainSubscribeAllHeadsNotif;

export type IngressMessage = Res | Notif;

export type ResByName = EnsureMethodLookup<Res, {
  account_nextIndex: AccountNextIndexRes;
  author_hasKey: AuthorHasKeyRes;
  author_hasSessionKeys: AuthorHasSessionKeysRes;
  author_pendingExtrinsics: AuthorPendingExtrinsicsRes;
  author_removeExtrinsics: AuthorRemoveExtrinsicRes;
  author_rotateKeys: AuthorRotateKeysRes;
  author_submitAndWatchExtrinsic: AuthorSubmitAndWatchExtrinsicRes;
  author_submitExtrinsic: AuthorSubmitExtrinsicRes;
  author_unwatchExtrinsic: AuthorUnwatchExtrinsicRes;
  babe_epochAuthorship: BabeEpochAuthorshipRes;
  chain_getBlock: ChainGetBlockRes;
  chain_getBlockHash: ChainGetBlockHashRes;
  chain_getFinalisedHead: ChainGetFinalizedHeadRes;
  chain_getFinalizedHead: ChainGetFinalizedHeadRes;
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
