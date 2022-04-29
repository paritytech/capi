import { ChainGetBlockEgressMessage, ChainGetBlockIngressMessage } from "./chain/GetBlock.ts";
import { ChainGetBlockHashEgressMessage, ChainGetBlockHashIngressMessage } from "./chain/GetBlockHash.ts";
import {
  ChainHeadUnstableFollowEgressMessage,
  ChainHeadUnstableFollowIngressMessage,
  ChainHeadUnstableFollowIngressNotificationMessage,
} from "./chainHead/unstable/Follow.ts";
import { EnsureLookup, MethodName } from "./common.ts";
import { StateGetMetadataEgressMessage, StateGetMetadataIngressMessage } from "./state/GetMetadata.ts";
import { StateGetStorageEgressMessage, StateGetStorageIngressMessage } from "./state/GetStorage.ts";
import { SystemChainTypeEgressMessage, SystemChainTypeIngressMessage } from "./system/ChainType.ts";
import { SystemHealthEgressMessage, SystemHealthIngressMessage } from "./system/Health.ts";

export type EgressMessage =
  | ChainGetBlockEgressMessage
  | ChainGetBlockHashEgressMessage
  | ChainHeadUnstableFollowEgressMessage
  | StateGetMetadataEgressMessage
  | StateGetStorageEgressMessage
  | SystemChainTypeEgressMessage
  | SystemHealthEgressMessage;

export type IngressOpaqueMessage =
  | ChainGetBlockIngressMessage
  | ChainGetBlockHashIngressMessage
  | ChainHeadUnstableFollowIngressMessage
  | StateGetMetadataIngressMessage
  | StateGetStorageIngressMessage
  | SystemChainTypeIngressMessage
  | SystemHealthIngressMessage;

export type IngressNotificationMessage = ChainHeadUnstableFollowIngressNotificationMessage;

export type IngressMessage = IngressOpaqueMessage | IngressNotificationMessage;

export type IngressMessageByName = EnsureLookup<IngressMessage, {
  [MethodName.ChainGetBlock]: ChainGetBlockIngressMessage;
  [MethodName.ChainGetBlockHash]: ChainGetBlockHashIngressMessage;
  [MethodName.ChainHeadUnstableFollow]: ChainHeadUnstableFollowIngressMessage;
  [MethodName.StateGetMetadata]: StateGetMetadataIngressMessage;
  [MethodName.StateGetStorage]: StateGetStorageIngressMessage;
  [MethodName.SystemChainType]: SystemChainTypeIngressMessage;
  [MethodName.SystemHealth]: SystemHealthIngressMessage;
}>;
