import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The active configuration for the current session. */
export const ActiveConfig = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Configuration",
  "ActiveConfig",
  $.tuple(),
  codecs.$638,
)

/**
 *  Pending configuration changes.
 *
 *  This is a list of configuration changes, each with a session index at which it should
 *  be applied.
 *
 *  The list is sorted ascending by session index. Also, this list can only contain at most
 *  2 items: for the next session and for the `scheduled_session`.
 */
export const PendingConfigs = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Configuration",
  "PendingConfigs",
  $.tuple(),
  codecs.$639,
)

/**
 *  If this is set, then the configuration setters will bypass the consistency checks. This
 *  is meant to be used only as the last resort.
 */
export const BypassConsistencyCheck = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Configuration",
  "BypassConsistencyCheck",
  $.tuple(),
  codecs.$43,
)

/** Set the validation upgrade cooldown. */
export function setValidationUpgradeCooldown(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeCooldown,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setValidationUpgradeCooldown" } }
}

/** Set the validation upgrade delay. */
export function setValidationUpgradeDelay(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setValidationUpgradeDelay,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setValidationUpgradeDelay" } }
}

/** Set the acceptance period for an included candidate. */
export function setCodeRetentionPeriod(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setCodeRetentionPeriod,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setCodeRetentionPeriod" } }
}

/** Set the max validation code size for incoming upgrades. */
export function setMaxCodeSize(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxCodeSize, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxCodeSize" } }
}

/** Set the max POV block size for incoming upgrades. */
export function setMaxPovSize(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxPovSize, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxPovSize" } }
}

/** Set the max head data size for paras. */
export function setMaxHeadDataSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxHeadDataSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxHeadDataSize" } }
}

/** Set the number of parathread execution cores. */
export function setParathreadCores(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadCores,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setParathreadCores" } }
}

/** Set the number of retries for a particular parathread. */
export function setParathreadRetries(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setParathreadRetries,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setParathreadRetries" } }
}

/** Set the parachain validator-group rotation frequency */
export function setGroupRotationFrequency(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setGroupRotationFrequency,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setGroupRotationFrequency" } }
}

/** Set the availability period for parachains. */
export function setChainAvailabilityPeriod(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setChainAvailabilityPeriod,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setChainAvailabilityPeriod" } }
}

/** Set the availability period for parathreads. */
export function setThreadAvailabilityPeriod(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setThreadAvailabilityPeriod,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setThreadAvailabilityPeriod" } }
}

/** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
export function setSchedulingLookahead(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setSchedulingLookahead,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setSchedulingLookahead" } }
}

/** Set the maximum number of validators to assign to any core. */
export function setMaxValidatorsPerCore(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidatorsPerCore,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxValidatorsPerCore" } }
}

/** Set the maximum number of validators to use in parachain consensus. */
export function setMaxValidators(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxValidators, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxValidators" } }
}

/** Set the dispute period, in number of sessions to keep for disputes. */
export function setDisputePeriod(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePeriod, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setDisputePeriod" } }
}

/** Set the dispute post conclusion acceptance period. */
export function setDisputePostConclusionAcceptancePeriod(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputePostConclusionAcceptancePeriod,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "setDisputePostConclusionAcceptancePeriod" },
  }
}

/** Set the maximum number of dispute spam slots. */
export function setDisputeMaxSpamSlots(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeMaxSpamSlots,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setDisputeMaxSpamSlots" } }
}

/** Set the dispute conclusion by time out period. */
export function setDisputeConclusionByTimeOutPeriod(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setDisputeConclusionByTimeOutPeriod,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setDisputeConclusionByTimeOutPeriod" } }
}

/**
 * Set the no show slots, in number of number of consensus slots.
 * Must be at least 1.
 */
export function setNoShowSlots(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setNoShowSlots, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setNoShowSlots" } }
}

/** Set the total number of delay tranches. */
export function setNDelayTranches(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setNDelayTranches,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setNDelayTranches" } }
}

/** Set the zeroth delay tranche width. */
export function setZerothDelayTrancheWidth(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setZerothDelayTrancheWidth,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setZerothDelayTrancheWidth" } }
}

/** Set the number of validators needed to approve a block. */
export function setNeededApprovals(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setNeededApprovals,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setNeededApprovals" } }
}

/** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
export function setRelayVrfModuloSamples(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setRelayVrfModuloSamples,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setRelayVrfModuloSamples" } }
}

/** Sets the maximum items that can present in a upward dispatch queue at once. */
export function setMaxUpwardQueueCount(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueCount,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxUpwardQueueCount" } }
}

/** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
export function setMaxUpwardQueueSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardQueueSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxUpwardQueueSize" } }
}

/** Set the critical downward message size. */
export function setMaxDownwardMessageSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxDownwardMessageSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxDownwardMessageSize" } }
}

/** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
export function setUmpServiceTotalWeight(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpServiceTotalWeight,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setUmpServiceTotalWeight" } }
}

/** Sets the maximum size of an upward message that can be sent by a candidate. */
export function setMaxUpwardMessageSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxUpwardMessageSize" } }
}

/** Sets the maximum number of messages that a candidate can contain. */
export function setMaxUpwardMessageNumPerCandidate(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setMaxUpwardMessageNumPerCandidate,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMaxUpwardMessageNumPerCandidate" } }
}

/** Sets the number of sessions after which an HRMP open channel request expires. */
export function setHrmpOpenRequestTtl(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpOpenRequestTtl,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpOpenRequestTtl" } }
}

/** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
export function setHrmpSenderDeposit(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpSenderDeposit,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpSenderDeposit" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpRecipientDeposit" } }
}

/** Sets the maximum number of messages allowed in an HRMP channel at once. */
export function setHrmpChannelMaxCapacity(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxCapacity,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpChannelMaxCapacity" } }
}

/** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
export function setHrmpChannelMaxTotalSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxTotalSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpChannelMaxTotalSize" } }
}

/** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
export function setHrmpMaxParachainInboundChannels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainInboundChannels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpMaxParachainInboundChannels" } }
}

/** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
export function setHrmpMaxParathreadInboundChannels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadInboundChannels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpMaxParathreadInboundChannels" } }
}

/** Sets the maximum size of a message that could ever be put into an HRMP channel. */
export function setHrmpChannelMaxMessageSize(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpChannelMaxMessageSize,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpChannelMaxMessageSize" } }
}

/** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
export function setHrmpMaxParachainOutboundChannels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParachainOutboundChannels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpMaxParachainOutboundChannels" } }
}

/** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
export function setHrmpMaxParathreadOutboundChannels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxParathreadOutboundChannels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "setHrmpMaxParathreadOutboundChannels" },
  }
}

/** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
export function setHrmpMaxMessageNumPerCandidate(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setHrmpMaxMessageNumPerCandidate,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setHrmpMaxMessageNumPerCandidate" } }
}

/** Sets the maximum amount of weight any individual upward message may consume. */
export function setUmpMaxIndividualWeight(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setUmpMaxIndividualWeight,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setUmpMaxIndividualWeight" } }
}

/** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
export function setPvfCheckingEnabled(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfCheckingEnabled,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setPvfCheckingEnabled" } }
}

/** Set the number of session changes after which a PVF pre-checking voting is rejected. */
export function setPvfVotingTtl(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.setPvfVotingTtl, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setPvfVotingTtl" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setMinimumValidationUpgradeDelay" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "setBypassConsistencyCheck" } }
}
