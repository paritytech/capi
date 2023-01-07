import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.configuration.pallet.Call> =
  codecs.$374
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeCooldown
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeDelay
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setCodeRetentionPeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxCodeSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxPovSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxHeadDataSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadCores
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadRetries
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setGroupRotationFrequency
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setChainAvailabilityPeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setThreadAvailabilityPeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setSchedulingLookahead
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidatorsPerCore
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidators
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePostConclusionAcceptancePeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeMaxSpamSlots
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeConclusionByTimeOutPeriod
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setNoShowSlots
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setNDelayTranches
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setZerothDelayTrancheWidth
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setNeededApprovals
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setRelayVrfModuloSamples
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueCount
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxDownwardMessageSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpServiceTotalWeight
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageNumPerCandidate
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpOpenRequestTtl
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpSenderDeposit
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpRecipientDeposit
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxCapacity
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxTotalSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainInboundChannels
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadInboundChannels
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxMessageSize
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainOutboundChannels
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadOutboundChannels
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxMessageNumPerCandidate
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpMaxIndividualWeight
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfCheckingEnabled
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfVotingTtl
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setMinimumValidationUpgradeDelay
  | types.polkadot_runtime_parachains.configuration.pallet.Call.setBypassConsistencyCheck
export namespace Call {
  /** Set the validation upgrade cooldown. */
  export interface setValidationUpgradeCooldown {
    type: "setValidationUpgradeCooldown"
    new: types.u32
  }
  /** Set the validation upgrade delay. */
  export interface setValidationUpgradeDelay {
    type: "setValidationUpgradeDelay"
    new: types.u32
  }
  /** Set the acceptance period for an included candidate. */
  export interface setCodeRetentionPeriod {
    type: "setCodeRetentionPeriod"
    new: types.u32
  }
  /** Set the max validation code size for incoming upgrades. */
  export interface setMaxCodeSize {
    type: "setMaxCodeSize"
    new: types.u32
  }
  /** Set the max POV block size for incoming upgrades. */
  export interface setMaxPovSize {
    type: "setMaxPovSize"
    new: types.u32
  }
  /** Set the max head data size for paras. */
  export interface setMaxHeadDataSize {
    type: "setMaxHeadDataSize"
    new: types.u32
  }
  /** Set the number of parathread execution cores. */
  export interface setParathreadCores {
    type: "setParathreadCores"
    new: types.u32
  }
  /** Set the number of retries for a particular parathread. */
  export interface setParathreadRetries {
    type: "setParathreadRetries"
    new: types.u32
  }
  /** Set the parachain validator-group rotation frequency */
  export interface setGroupRotationFrequency {
    type: "setGroupRotationFrequency"
    new: types.u32
  }
  /** Set the availability period for parachains. */
  export interface setChainAvailabilityPeriod {
    type: "setChainAvailabilityPeriod"
    new: types.u32
  }
  /** Set the availability period for parathreads. */
  export interface setThreadAvailabilityPeriod {
    type: "setThreadAvailabilityPeriod"
    new: types.u32
  }
  /** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
  export interface setSchedulingLookahead {
    type: "setSchedulingLookahead"
    new: types.u32
  }
  /** Set the maximum number of validators to assign to any core. */
  export interface setMaxValidatorsPerCore {
    type: "setMaxValidatorsPerCore"
    new: types.u32 | undefined
  }
  /** Set the maximum number of validators to use in parachain consensus. */
  export interface setMaxValidators {
    type: "setMaxValidators"
    new: types.u32 | undefined
  }
  /** Set the dispute period, in number of sessions to keep for disputes. */
  export interface setDisputePeriod {
    type: "setDisputePeriod"
    new: types.u32
  }
  /** Set the dispute post conclusion acceptance period. */
  export interface setDisputePostConclusionAcceptancePeriod {
    type: "setDisputePostConclusionAcceptancePeriod"
    new: types.u32
  }
  /** Set the maximum number of dispute spam slots. */
  export interface setDisputeMaxSpamSlots {
    type: "setDisputeMaxSpamSlots"
    new: types.u32
  }
  /** Set the dispute conclusion by time out period. */
  export interface setDisputeConclusionByTimeOutPeriod {
    type: "setDisputeConclusionByTimeOutPeriod"
    new: types.u32
  }
  /**
   * Set the no show slots, in number of number of consensus slots.
   * Must be at least 1.
   */
  export interface setNoShowSlots {
    type: "setNoShowSlots"
    new: types.u32
  }
  /** Set the total number of delay tranches. */
  export interface setNDelayTranches {
    type: "setNDelayTranches"
    new: types.u32
  }
  /** Set the zeroth delay tranche width. */
  export interface setZerothDelayTrancheWidth {
    type: "setZerothDelayTrancheWidth"
    new: types.u32
  }
  /** Set the number of validators needed to approve a block. */
  export interface setNeededApprovals {
    type: "setNeededApprovals"
    new: types.u32
  }
  /** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
  export interface setRelayVrfModuloSamples {
    type: "setRelayVrfModuloSamples"
    new: types.u32
  }
  /** Sets the maximum items that can present in a upward dispatch queue at once. */
  export interface setMaxUpwardQueueCount {
    type: "setMaxUpwardQueueCount"
    new: types.u32
  }
  /** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
  export interface setMaxUpwardQueueSize {
    type: "setMaxUpwardQueueSize"
    new: types.u32
  }
  /** Set the critical downward message size. */
  export interface setMaxDownwardMessageSize {
    type: "setMaxDownwardMessageSize"
    new: types.u32
  }
  /** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
  export interface setUmpServiceTotalWeight {
    type: "setUmpServiceTotalWeight"
    new: types.frame_support.weights.weight_v2.Weight
  }
  /** Sets the maximum size of an upward message that can be sent by a candidate. */
  export interface setMaxUpwardMessageSize {
    type: "setMaxUpwardMessageSize"
    new: types.u32
  }
  /** Sets the maximum number of messages that a candidate can contain. */
  export interface setMaxUpwardMessageNumPerCandidate {
    type: "setMaxUpwardMessageNumPerCandidate"
    new: types.u32
  }
  /** Sets the number of sessions after which an HRMP open channel request expires. */
  export interface setHrmpOpenRequestTtl {
    type: "setHrmpOpenRequestTtl"
    new: types.u32
  }
  /** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
  export interface setHrmpSenderDeposit {
    type: "setHrmpSenderDeposit"
    new: types.u128
  }
  /**
   * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
   * channel.
   */
  export interface setHrmpRecipientDeposit {
    type: "setHrmpRecipientDeposit"
    new: types.u128
  }
  /** Sets the maximum number of messages allowed in an HRMP channel at once. */
  export interface setHrmpChannelMaxCapacity {
    type: "setHrmpChannelMaxCapacity"
    new: types.u32
  }
  /** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
  export interface setHrmpChannelMaxTotalSize {
    type: "setHrmpChannelMaxTotalSize"
    new: types.u32
  }
  /** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
  export interface setHrmpMaxParachainInboundChannels {
    type: "setHrmpMaxParachainInboundChannels"
    new: types.u32
  }
  /** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
  export interface setHrmpMaxParathreadInboundChannels {
    type: "setHrmpMaxParathreadInboundChannels"
    new: types.u32
  }
  /** Sets the maximum size of a message that could ever be put into an HRMP channel. */
  export interface setHrmpChannelMaxMessageSize {
    type: "setHrmpChannelMaxMessageSize"
    new: types.u32
  }
  /** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
  export interface setHrmpMaxParachainOutboundChannels {
    type: "setHrmpMaxParachainOutboundChannels"
    new: types.u32
  }
  /** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
  export interface setHrmpMaxParathreadOutboundChannels {
    type: "setHrmpMaxParathreadOutboundChannels"
    new: types.u32
  }
  /** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
  export interface setHrmpMaxMessageNumPerCandidate {
    type: "setHrmpMaxMessageNumPerCandidate"
    new: types.u32
  }
  /** Sets the maximum amount of weight any individual upward message may consume. */
  export interface setUmpMaxIndividualWeight {
    type: "setUmpMaxIndividualWeight"
    new: types.frame_support.weights.weight_v2.Weight
  }
  /** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
  export interface setPvfCheckingEnabled {
    type: "setPvfCheckingEnabled"
    new: boolean
  }
  /** Set the number of session changes after which a PVF pre-checking voting is rejected. */
  export interface setPvfVotingTtl {
    type: "setPvfVotingTtl"
    new: types.u32
  }
  /**
   * Sets the minimum delay between announcing the upgrade block for a parachain until the
   * upgrade taking place.
   *
   * See the field documentation for information and constraints for the new value.
   */
  export interface setMinimumValidationUpgradeDelay {
    type: "setMinimumValidationUpgradeDelay"
    new: types.u32
  }
  /**
   * Setting this to true will disable consistency checks for the configuration setters.
   * Use with caution.
   */
  export interface setBypassConsistencyCheck {
    type: "setBypassConsistencyCheck"
    new: boolean
  }
  /** Set the validation upgrade cooldown. */
  export function setValidationUpgradeCooldown(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeCooldown,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeCooldown {
    return { type: "setValidationUpgradeCooldown", ...value }
  }
  /** Set the validation upgrade delay. */
  export function setValidationUpgradeDelay(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeDelay,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeDelay {
    return { type: "setValidationUpgradeDelay", ...value }
  }
  /** Set the acceptance period for an included candidate. */
  export function setCodeRetentionPeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setCodeRetentionPeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setCodeRetentionPeriod {
    return { type: "setCodeRetentionPeriod", ...value }
  }
  /** Set the max validation code size for incoming upgrades. */
  export function setMaxCodeSize(
    value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxCodeSize, "type">,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxCodeSize {
    return { type: "setMaxCodeSize", ...value }
  }
  /** Set the max POV block size for incoming upgrades. */
  export function setMaxPovSize(
    value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxPovSize, "type">,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxPovSize {
    return { type: "setMaxPovSize", ...value }
  }
  /** Set the max head data size for paras. */
  export function setMaxHeadDataSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxHeadDataSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxHeadDataSize {
    return { type: "setMaxHeadDataSize", ...value }
  }
  /** Set the number of parathread execution cores. */
  export function setParathreadCores(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadCores,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadCores {
    return { type: "setParathreadCores", ...value }
  }
  /** Set the number of retries for a particular parathread. */
  export function setParathreadRetries(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadRetries,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadRetries {
    return { type: "setParathreadRetries", ...value }
  }
  /** Set the parachain validator-group rotation frequency */
  export function setGroupRotationFrequency(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setGroupRotationFrequency,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setGroupRotationFrequency {
    return { type: "setGroupRotationFrequency", ...value }
  }
  /** Set the availability period for parachains. */
  export function setChainAvailabilityPeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setChainAvailabilityPeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setChainAvailabilityPeriod {
    return { type: "setChainAvailabilityPeriod", ...value }
  }
  /** Set the availability period for parathreads. */
  export function setThreadAvailabilityPeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setThreadAvailabilityPeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setThreadAvailabilityPeriod {
    return { type: "setThreadAvailabilityPeriod", ...value }
  }
  /** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
  export function setSchedulingLookahead(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setSchedulingLookahead,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setSchedulingLookahead {
    return { type: "setSchedulingLookahead", ...value }
  }
  /** Set the maximum number of validators to assign to any core. */
  export function setMaxValidatorsPerCore(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidatorsPerCore,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidatorsPerCore {
    return { type: "setMaxValidatorsPerCore", ...value }
  }
  /** Set the maximum number of validators to use in parachain consensus. */
  export function setMaxValidators(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidators,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidators {
    return { type: "setMaxValidators", ...value }
  }
  /** Set the dispute period, in number of sessions to keep for disputes. */
  export function setDisputePeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePeriod {
    return { type: "setDisputePeriod", ...value }
  }
  /** Set the dispute post conclusion acceptance period. */
  export function setDisputePostConclusionAcceptancePeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePostConclusionAcceptancePeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePostConclusionAcceptancePeriod {
    return { type: "setDisputePostConclusionAcceptancePeriod", ...value }
  }
  /** Set the maximum number of dispute spam slots. */
  export function setDisputeMaxSpamSlots(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeMaxSpamSlots,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeMaxSpamSlots {
    return { type: "setDisputeMaxSpamSlots", ...value }
  }
  /** Set the dispute conclusion by time out period. */
  export function setDisputeConclusionByTimeOutPeriod(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeConclusionByTimeOutPeriod,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeConclusionByTimeOutPeriod {
    return { type: "setDisputeConclusionByTimeOutPeriod", ...value }
  }
  /**
   * Set the no show slots, in number of number of consensus slots.
   * Must be at least 1.
   */
  export function setNoShowSlots(
    value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setNoShowSlots, "type">,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setNoShowSlots {
    return { type: "setNoShowSlots", ...value }
  }
  /** Set the total number of delay tranches. */
  export function setNDelayTranches(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setNDelayTranches,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setNDelayTranches {
    return { type: "setNDelayTranches", ...value }
  }
  /** Set the zeroth delay tranche width. */
  export function setZerothDelayTrancheWidth(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setZerothDelayTrancheWidth,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setZerothDelayTrancheWidth {
    return { type: "setZerothDelayTrancheWidth", ...value }
  }
  /** Set the number of validators needed to approve a block. */
  export function setNeededApprovals(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setNeededApprovals,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setNeededApprovals {
    return { type: "setNeededApprovals", ...value }
  }
  /** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
  export function setRelayVrfModuloSamples(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setRelayVrfModuloSamples,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setRelayVrfModuloSamples {
    return { type: "setRelayVrfModuloSamples", ...value }
  }
  /** Sets the maximum items that can present in a upward dispatch queue at once. */
  export function setMaxUpwardQueueCount(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueCount,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueCount {
    return { type: "setMaxUpwardQueueCount", ...value }
  }
  /** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
  export function setMaxUpwardQueueSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueSize {
    return { type: "setMaxUpwardQueueSize", ...value }
  }
  /** Set the critical downward message size. */
  export function setMaxDownwardMessageSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxDownwardMessageSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxDownwardMessageSize {
    return { type: "setMaxDownwardMessageSize", ...value }
  }
  /** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
  export function setUmpServiceTotalWeight(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpServiceTotalWeight,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpServiceTotalWeight {
    return { type: "setUmpServiceTotalWeight", ...value }
  }
  /** Sets the maximum size of an upward message that can be sent by a candidate. */
  export function setMaxUpwardMessageSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageSize {
    return { type: "setMaxUpwardMessageSize", ...value }
  }
  /** Sets the maximum number of messages that a candidate can contain. */
  export function setMaxUpwardMessageNumPerCandidate(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageNumPerCandidate,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageNumPerCandidate {
    return { type: "setMaxUpwardMessageNumPerCandidate", ...value }
  }
  /** Sets the number of sessions after which an HRMP open channel request expires. */
  export function setHrmpOpenRequestTtl(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpOpenRequestTtl,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpOpenRequestTtl {
    return { type: "setHrmpOpenRequestTtl", ...value }
  }
  /** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
  export function setHrmpSenderDeposit(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpSenderDeposit,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpSenderDeposit {
    return { type: "setHrmpSenderDeposit", ...value }
  }
  /**
   * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
   * channel.
   */
  export function setHrmpRecipientDeposit(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpRecipientDeposit,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpRecipientDeposit {
    return { type: "setHrmpRecipientDeposit", ...value }
  }
  /** Sets the maximum number of messages allowed in an HRMP channel at once. */
  export function setHrmpChannelMaxCapacity(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxCapacity,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxCapacity {
    return { type: "setHrmpChannelMaxCapacity", ...value }
  }
  /** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
  export function setHrmpChannelMaxTotalSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxTotalSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxTotalSize {
    return { type: "setHrmpChannelMaxTotalSize", ...value }
  }
  /** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
  export function setHrmpMaxParachainInboundChannels(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainInboundChannels,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainInboundChannels {
    return { type: "setHrmpMaxParachainInboundChannels", ...value }
  }
  /** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
  export function setHrmpMaxParathreadInboundChannels(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadInboundChannels,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadInboundChannels {
    return { type: "setHrmpMaxParathreadInboundChannels", ...value }
  }
  /** Sets the maximum size of a message that could ever be put into an HRMP channel. */
  export function setHrmpChannelMaxMessageSize(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxMessageSize,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxMessageSize {
    return { type: "setHrmpChannelMaxMessageSize", ...value }
  }
  /** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
  export function setHrmpMaxParachainOutboundChannels(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainOutboundChannels,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainOutboundChannels {
    return { type: "setHrmpMaxParachainOutboundChannels", ...value }
  }
  /** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
  export function setHrmpMaxParathreadOutboundChannels(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadOutboundChannels,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadOutboundChannels {
    return { type: "setHrmpMaxParathreadOutboundChannels", ...value }
  }
  /** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
  export function setHrmpMaxMessageNumPerCandidate(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxMessageNumPerCandidate,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxMessageNumPerCandidate {
    return { type: "setHrmpMaxMessageNumPerCandidate", ...value }
  }
  /** Sets the maximum amount of weight any individual upward message may consume. */
  export function setUmpMaxIndividualWeight(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpMaxIndividualWeight,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpMaxIndividualWeight {
    return { type: "setUmpMaxIndividualWeight", ...value }
  }
  /** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
  export function setPvfCheckingEnabled(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfCheckingEnabled,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfCheckingEnabled {
    return { type: "setPvfCheckingEnabled", ...value }
  }
  /** Set the number of session changes after which a PVF pre-checking voting is rejected. */
  export function setPvfVotingTtl(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfVotingTtl,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfVotingTtl {
    return { type: "setPvfVotingTtl", ...value }
  }
  /**
   * Sets the minimum delay between announcing the upgrade block for a parachain until the
   * upgrade taking place.
   *
   * See the field documentation for information and constraints for the new value.
   */
  export function setMinimumValidationUpgradeDelay(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setMinimumValidationUpgradeDelay,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setMinimumValidationUpgradeDelay {
    return { type: "setMinimumValidationUpgradeDelay", ...value }
  }
  /**
   * Setting this to true will disable consistency checks for the configuration setters.
   * Use with caution.
   */
  export function setBypassConsistencyCheck(
    value: Omit<
      types.polkadot_runtime_parachains.configuration.pallet.Call.setBypassConsistencyCheck,
      "type"
    >,
  ): types.polkadot_runtime_parachains.configuration.pallet.Call.setBypassConsistencyCheck {
    return { type: "setBypassConsistencyCheck", ...value }
  }
}

export const $error: $.Codec<types.polkadot_runtime_parachains.configuration.pallet.Error> =
  codecs.$633
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error = "InvalidNewValue"
