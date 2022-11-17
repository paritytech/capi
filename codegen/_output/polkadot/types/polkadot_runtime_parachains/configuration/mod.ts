import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface HostConfiguration {
  maxCodeSize: types.u32
  maxHeadDataSize: types.u32
  maxUpwardQueueCount: types.u32
  maxUpwardQueueSize: types.u32
  maxUpwardMessageSize: types.u32
  maxUpwardMessageNumPerCandidate: types.u32
  hrmpMaxMessageNumPerCandidate: types.u32
  validationUpgradeCooldown: types.u32
  validationUpgradeDelay: types.u32
  maxPovSize: types.u32
  maxDownwardMessageSize: types.u32
  umpServiceTotalWeight: types.sp_weights.weight_v2.Weight
  hrmpMaxParachainOutboundChannels: types.u32
  hrmpMaxParathreadOutboundChannels: types.u32
  hrmpSenderDeposit: types.u128
  hrmpRecipientDeposit: types.u128
  hrmpChannelMaxCapacity: types.u32
  hrmpChannelMaxTotalSize: types.u32
  hrmpMaxParachainInboundChannels: types.u32
  hrmpMaxParathreadInboundChannels: types.u32
  hrmpChannelMaxMessageSize: types.u32
  codeRetentionPeriod: types.u32
  parathreadCores: types.u32
  parathreadRetries: types.u32
  groupRotationFrequency: types.u32
  chainAvailabilityPeriod: types.u32
  threadAvailabilityPeriod: types.u32
  schedulingLookahead: types.u32
  maxValidatorsPerCore: types.u32 | undefined
  maxValidators: types.u32 | undefined
  disputePeriod: types.u32
  disputePostConclusionAcceptancePeriod: types.u32
  disputeMaxSpamSlots: types.u32
  disputeConclusionByTimeOutPeriod: types.u32
  noShowSlots: types.u32
  nDelayTranches: types.u32
  zerothDelayTrancheWidth: types.u32
  neededApprovals: types.u32
  relayVrfModuloSamples: types.u32
  umpMaxIndividualWeight: types.sp_weights.weight_v2.Weight
  pvfCheckingEnabled: boolean
  pvfVotingTtl: types.u32
  minimumValidationUpgradeDelay: types.u32
}

export function HostConfiguration(
  value: types.polkadot_runtime_parachains.configuration.HostConfiguration,
) {
  return value
}
