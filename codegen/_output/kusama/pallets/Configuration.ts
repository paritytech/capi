import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The active configuration for the current session. */
export const ActiveConfig = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Configuration",
  "ActiveConfig",
  $.tuple(),
  _codec.$638,
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
  _codec.$43,
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
  _codec.$639,
)

/**
 * Setting this to true will disable consistency checks for the configuration setters.
 * Use with caution.
 */
export function set_bypass_consistency_check(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_bypass_consistency_check,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_bypass_consistency_check" } }
}

/** Set the availability period for parachains. */
export function set_chain_availability_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_chain_availability_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_chain_availability_period" } }
}

/** Set the acceptance period for an included candidate. */
export function set_code_retention_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_code_retention_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_code_retention_period" } }
}

/** Set the dispute conclusion by time out period. */
export function set_dispute_conclusion_by_time_out_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_conclusion_by_time_out_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_dispute_conclusion_by_time_out_period" },
  }
}

/** Set the maximum number of dispute spam slots. */
export function set_dispute_max_spam_slots(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_max_spam_slots,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_dispute_max_spam_slots" } }
}

/** Set the dispute period, in number of sessions to keep for disputes. */
export function set_dispute_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_dispute_period" } }
}

/** Set the dispute post conclusion acceptance period. */
export function set_dispute_post_conclusion_acceptance_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_post_conclusion_acceptance_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_dispute_post_conclusion_acceptance_period" },
  }
}

/** Set the parachain validator-group rotation frequency */
export function set_group_rotation_frequency(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_group_rotation_frequency,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_group_rotation_frequency" } }
}

/** Sets the maximum number of messages allowed in an HRMP channel at once. */
export function set_hrmp_channel_max_capacity(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_capacity,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_channel_max_capacity" } }
}

/** Sets the maximum size of a message that could ever be put into an HRMP channel. */
export function set_hrmp_channel_max_message_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_message_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_channel_max_message_size" } }
}

/** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
export function set_hrmp_channel_max_total_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_total_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_channel_max_total_size" } }
}

/** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
export function set_hrmp_max_message_num_per_candidate(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_message_num_per_candidate,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_hrmp_max_message_num_per_candidate" },
  }
}

/** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
export function set_hrmp_max_parachain_inbound_channels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_inbound_channels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_hrmp_max_parachain_inbound_channels" },
  }
}

/** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
export function set_hrmp_max_parachain_outbound_channels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_outbound_channels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_hrmp_max_parachain_outbound_channels" },
  }
}

/** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
export function set_hrmp_max_parathread_inbound_channels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_inbound_channels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_hrmp_max_parathread_inbound_channels" },
  }
}

/** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
export function set_hrmp_max_parathread_outbound_channels(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_outbound_channels,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_hrmp_max_parathread_outbound_channels" },
  }
}

/** Sets the number of sessions after which an HRMP open channel request expires. */
export function set_hrmp_open_request_ttl(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_open_request_ttl,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_open_request_ttl" } }
}

/**
 * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
 * channel.
 */
export function set_hrmp_recipient_deposit(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_recipient_deposit,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_recipient_deposit" } }
}

/** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
export function set_hrmp_sender_deposit(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_sender_deposit,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_hrmp_sender_deposit" } }
}

/** Set the max validation code size for incoming upgrades. */
export function set_max_code_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_code_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_code_size" } }
}

/** Set the critical downward message size. */
export function set_max_downward_message_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_downward_message_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_downward_message_size" } }
}

/** Set the max head data size for paras. */
export function set_max_head_data_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_head_data_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_head_data_size" } }
}

/** Set the max POV block size for incoming upgrades. */
export function set_max_pov_size(
  value: Omit<types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_pov_size, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_pov_size" } }
}

/** Sets the maximum number of messages that a candidate can contain. */
export function set_max_upward_message_num_per_candidate(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_num_per_candidate,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_max_upward_message_num_per_candidate" },
  }
}

/** Sets the maximum size of an upward message that can be sent by a candidate. */
export function set_max_upward_message_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_upward_message_size" } }
}

/** Sets the maximum items that can present in a upward dispatch queue at once. */
export function set_max_upward_queue_count(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_count,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_upward_queue_count" } }
}

/** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
export function set_max_upward_queue_size(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_size,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_upward_queue_size" } }
}

/** Set the maximum number of validators to use in parachain consensus. */
export function set_max_validators(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_validators" } }
}

/** Set the maximum number of validators to assign to any core. */
export function set_max_validators_per_core(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators_per_core,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_max_validators_per_core" } }
}

/**
 * Sets the minimum delay between announcing the upgrade block for a parachain until the
 * upgrade taking place.
 *
 * See the field documentation for information and constraints for the new value.
 */
export function set_minimum_validation_upgrade_delay(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_minimum_validation_upgrade_delay,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return {
    type: "Configuration",
    value: { ...value, type: "set_minimum_validation_upgrade_delay" },
  }
}

/** Set the total number of delay tranches. */
export function set_n_delay_tranches(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_n_delay_tranches,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_n_delay_tranches" } }
}

/** Set the number of validators needed to approve a block. */
export function set_needed_approvals(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_needed_approvals,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_needed_approvals" } }
}

/**
 * Set the no show slots, in number of number of consensus slots.
 * Must be at least 1.
 */
export function set_no_show_slots(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_no_show_slots,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_no_show_slots" } }
}

/** Set the number of parathread execution cores. */
export function set_parathread_cores(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_cores,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_parathread_cores" } }
}

/** Set the number of retries for a particular parathread. */
export function set_parathread_retries(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_retries,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_parathread_retries" } }
}

/** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
export function set_pvf_checking_enabled(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_checking_enabled,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_pvf_checking_enabled" } }
}

/** Set the number of session changes after which a PVF pre-checking voting is rejected. */
export function set_pvf_voting_ttl(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_voting_ttl,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_pvf_voting_ttl" } }
}

/** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
export function set_relay_vrf_modulo_samples(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_relay_vrf_modulo_samples,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_relay_vrf_modulo_samples" } }
}

/** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
export function set_scheduling_lookahead(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_scheduling_lookahead,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_scheduling_lookahead" } }
}

/** Set the availability period for parathreads. */
export function set_thread_availability_period(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_thread_availability_period,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_thread_availability_period" } }
}

/** Sets the maximum amount of weight any individual upward message may consume. */
export function set_ump_max_individual_weight(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_max_individual_weight,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_ump_max_individual_weight" } }
}

/** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
export function set_ump_service_total_weight(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_service_total_weight,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_ump_service_total_weight" } }
}

/** Set the validation upgrade cooldown. */
export function set_validation_upgrade_cooldown(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_cooldown,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_validation_upgrade_cooldown" } }
}

/** Set the validation upgrade delay. */
export function set_validation_upgrade_delay(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_delay,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_validation_upgrade_delay" } }
}

/** Set the zeroth delay tranche width. */
export function set_zeroth_delay_tranche_width(
  value: Omit<
    types.polkadot_runtime_parachains.configuration.pallet.Call.set_zeroth_delay_tranche_width,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Configuration", value: { ...value, type: "set_zeroth_delay_tranche_width" } }
}
