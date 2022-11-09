import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $call: $.Codec<t.polkadot_runtime_parachains.configuration.pallet.Call> = _codec.$375

export const $error: $.Codec<t.polkadot_runtime_parachains.configuration.pallet.Error> = _codec.$641

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_cooldown
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_delay
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_code_retention_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_code_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_pov_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_head_data_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_cores
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_retries
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_group_rotation_frequency
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_chain_availability_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_thread_availability_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_scheduling_lookahead
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators_per_core
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_post_conclusion_acceptance_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_max_spam_slots
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_conclusion_by_time_out_period
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_no_show_slots
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_n_delay_tranches
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_zeroth_delay_tranche_width
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_needed_approvals
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_relay_vrf_modulo_samples
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_count
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_downward_message_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_service_total_weight
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_num_per_candidate
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_open_request_ttl
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_sender_deposit
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_recipient_deposit
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_capacity
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_total_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_inbound_channels
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_inbound_channels
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_message_size
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_outbound_channels
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_outbound_channels
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_message_num_per_candidate
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_max_individual_weight
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_checking_enabled
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_voting_ttl
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_minimum_validation_upgrade_delay
  | t.polkadot_runtime_parachains.configuration.pallet.Call.set_bypass_consistency_check
export namespace Call {
  /** Set the validation upgrade cooldown. */
  export interface set_validation_upgrade_cooldown {
    type: "set_validation_upgrade_cooldown"
    new: t.u32
  }
  /** Set the validation upgrade delay. */
  export interface set_validation_upgrade_delay {
    type: "set_validation_upgrade_delay"
    new: t.u32
  }
  /** Set the acceptance period for an included candidate. */
  export interface set_code_retention_period {
    type: "set_code_retention_period"
    new: t.u32
  }
  /** Set the max validation code size for incoming upgrades. */
  export interface set_max_code_size {
    type: "set_max_code_size"
    new: t.u32
  }
  /** Set the max POV block size for incoming upgrades. */
  export interface set_max_pov_size {
    type: "set_max_pov_size"
    new: t.u32
  }
  /** Set the max head data size for paras. */
  export interface set_max_head_data_size {
    type: "set_max_head_data_size"
    new: t.u32
  }
  /** Set the number of parathread execution cores. */
  export interface set_parathread_cores {
    type: "set_parathread_cores"
    new: t.u32
  }
  /** Set the number of retries for a particular parathread. */
  export interface set_parathread_retries {
    type: "set_parathread_retries"
    new: t.u32
  }
  /** Set the parachain validator-group rotation frequency */
  export interface set_group_rotation_frequency {
    type: "set_group_rotation_frequency"
    new: t.u32
  }
  /** Set the availability period for parachains. */
  export interface set_chain_availability_period {
    type: "set_chain_availability_period"
    new: t.u32
  }
  /** Set the availability period for parathreads. */
  export interface set_thread_availability_period {
    type: "set_thread_availability_period"
    new: t.u32
  }
  /** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
  export interface set_scheduling_lookahead {
    type: "set_scheduling_lookahead"
    new: t.u32
  }
  /** Set the maximum number of validators to assign to any core. */
  export interface set_max_validators_per_core {
    type: "set_max_validators_per_core"
    new: t.u32 | undefined
  }
  /** Set the maximum number of validators to use in parachain consensus. */
  export interface set_max_validators {
    type: "set_max_validators"
    new: t.u32 | undefined
  }
  /** Set the dispute period, in number of sessions to keep for disputes. */
  export interface set_dispute_period {
    type: "set_dispute_period"
    new: t.u32
  }
  /** Set the dispute post conclusion acceptance period. */
  export interface set_dispute_post_conclusion_acceptance_period {
    type: "set_dispute_post_conclusion_acceptance_period"
    new: t.u32
  }
  /** Set the maximum number of dispute spam slots. */
  export interface set_dispute_max_spam_slots {
    type: "set_dispute_max_spam_slots"
    new: t.u32
  }
  /** Set the dispute conclusion by time out period. */
  export interface set_dispute_conclusion_by_time_out_period {
    type: "set_dispute_conclusion_by_time_out_period"
    new: t.u32
  }
  /**
   * Set the no show slots, in number of number of consensus slots.
   * Must be at least 1.
   */
  export interface set_no_show_slots {
    type: "set_no_show_slots"
    new: t.u32
  }
  /** Set the total number of delay tranches. */
  export interface set_n_delay_tranches {
    type: "set_n_delay_tranches"
    new: t.u32
  }
  /** Set the zeroth delay tranche width. */
  export interface set_zeroth_delay_tranche_width {
    type: "set_zeroth_delay_tranche_width"
    new: t.u32
  }
  /** Set the number of validators needed to approve a block. */
  export interface set_needed_approvals {
    type: "set_needed_approvals"
    new: t.u32
  }
  /** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
  export interface set_relay_vrf_modulo_samples {
    type: "set_relay_vrf_modulo_samples"
    new: t.u32
  }
  /** Sets the maximum items that can present in a upward dispatch queue at once. */
  export interface set_max_upward_queue_count {
    type: "set_max_upward_queue_count"
    new: t.u32
  }
  /** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
  export interface set_max_upward_queue_size {
    type: "set_max_upward_queue_size"
    new: t.u32
  }
  /** Set the critical downward message size. */
  export interface set_max_downward_message_size {
    type: "set_max_downward_message_size"
    new: t.u32
  }
  /** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
  export interface set_ump_service_total_weight {
    type: "set_ump_service_total_weight"
    new: t.sp_weights.weight_v2.Weight
  }
  /** Sets the maximum size of an upward message that can be sent by a candidate. */
  export interface set_max_upward_message_size {
    type: "set_max_upward_message_size"
    new: t.u32
  }
  /** Sets the maximum number of messages that a candidate can contain. */
  export interface set_max_upward_message_num_per_candidate {
    type: "set_max_upward_message_num_per_candidate"
    new: t.u32
  }
  /** Sets the number of sessions after which an HRMP open channel request expires. */
  export interface set_hrmp_open_request_ttl {
    type: "set_hrmp_open_request_ttl"
    new: t.u32
  }
  /** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
  export interface set_hrmp_sender_deposit {
    type: "set_hrmp_sender_deposit"
    new: t.u128
  }
  /**
   * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
   * channel.
   */
  export interface set_hrmp_recipient_deposit {
    type: "set_hrmp_recipient_deposit"
    new: t.u128
  }
  /** Sets the maximum number of messages allowed in an HRMP channel at once. */
  export interface set_hrmp_channel_max_capacity {
    type: "set_hrmp_channel_max_capacity"
    new: t.u32
  }
  /** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
  export interface set_hrmp_channel_max_total_size {
    type: "set_hrmp_channel_max_total_size"
    new: t.u32
  }
  /** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
  export interface set_hrmp_max_parachain_inbound_channels {
    type: "set_hrmp_max_parachain_inbound_channels"
    new: t.u32
  }
  /** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
  export interface set_hrmp_max_parathread_inbound_channels {
    type: "set_hrmp_max_parathread_inbound_channels"
    new: t.u32
  }
  /** Sets the maximum size of a message that could ever be put into an HRMP channel. */
  export interface set_hrmp_channel_max_message_size {
    type: "set_hrmp_channel_max_message_size"
    new: t.u32
  }
  /** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
  export interface set_hrmp_max_parachain_outbound_channels {
    type: "set_hrmp_max_parachain_outbound_channels"
    new: t.u32
  }
  /** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
  export interface set_hrmp_max_parathread_outbound_channels {
    type: "set_hrmp_max_parathread_outbound_channels"
    new: t.u32
  }
  /** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
  export interface set_hrmp_max_message_num_per_candidate {
    type: "set_hrmp_max_message_num_per_candidate"
    new: t.u32
  }
  /** Sets the maximum amount of weight any individual upward message may consume. */
  export interface set_ump_max_individual_weight {
    type: "set_ump_max_individual_weight"
    new: t.sp_weights.weight_v2.Weight
  }
  /** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
  export interface set_pvf_checking_enabled {
    type: "set_pvf_checking_enabled"
    new: boolean
  }
  /** Set the number of session changes after which a PVF pre-checking voting is rejected. */
  export interface set_pvf_voting_ttl {
    type: "set_pvf_voting_ttl"
    new: t.u32
  }
  /**
   * Sets the minimum delay between announcing the upgrade block for a parachain until the
   * upgrade taking place.
   *
   * See the field documentation for information and constraints for the new value.
   */
  export interface set_minimum_validation_upgrade_delay {
    type: "set_minimum_validation_upgrade_delay"
    new: t.u32
  }
  /**
   * Setting this to true will disable consistency checks for the configuration setters.
   * Use with caution.
   */
  export interface set_bypass_consistency_check {
    type: "set_bypass_consistency_check"
    new: boolean
  }
  /** Set the validation upgrade cooldown. */
  export function set_validation_upgrade_cooldown(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_cooldown,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_cooldown {
    return { type: "set_validation_upgrade_cooldown", ...value }
  }
  /** Set the validation upgrade delay. */
  export function set_validation_upgrade_delay(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_delay,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_validation_upgrade_delay {
    return { type: "set_validation_upgrade_delay", ...value }
  }
  /** Set the acceptance period for an included candidate. */
  export function set_code_retention_period(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_code_retention_period,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_code_retention_period {
    return { type: "set_code_retention_period", ...value }
  }
  /** Set the max validation code size for incoming upgrades. */
  export function set_max_code_size(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_code_size, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_code_size {
    return { type: "set_max_code_size", ...value }
  }
  /** Set the max POV block size for incoming upgrades. */
  export function set_max_pov_size(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_pov_size, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_pov_size {
    return { type: "set_max_pov_size", ...value }
  }
  /** Set the max head data size for paras. */
  export function set_max_head_data_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_head_data_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_head_data_size {
    return { type: "set_max_head_data_size", ...value }
  }
  /** Set the number of parathread execution cores. */
  export function set_parathread_cores(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_cores,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_cores {
    return { type: "set_parathread_cores", ...value }
  }
  /** Set the number of retries for a particular parathread. */
  export function set_parathread_retries(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_retries,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_parathread_retries {
    return { type: "set_parathread_retries", ...value }
  }
  /** Set the parachain validator-group rotation frequency */
  export function set_group_rotation_frequency(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_group_rotation_frequency,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_group_rotation_frequency {
    return { type: "set_group_rotation_frequency", ...value }
  }
  /** Set the availability period for parachains. */
  export function set_chain_availability_period(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_chain_availability_period,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_chain_availability_period {
    return { type: "set_chain_availability_period", ...value }
  }
  /** Set the availability period for parathreads. */
  export function set_thread_availability_period(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_thread_availability_period,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_thread_availability_period {
    return { type: "set_thread_availability_period", ...value }
  }
  /** Set the scheduling lookahead, in expected number of blocks at peak throughput. */
  export function set_scheduling_lookahead(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_scheduling_lookahead,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_scheduling_lookahead {
    return { type: "set_scheduling_lookahead", ...value }
  }
  /** Set the maximum number of validators to assign to any core. */
  export function set_max_validators_per_core(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators_per_core,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators_per_core {
    return { type: "set_max_validators_per_core", ...value }
  }
  /** Set the maximum number of validators to use in parachain consensus. */
  export function set_max_validators(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_validators {
    return { type: "set_max_validators", ...value }
  }
  /** Set the dispute period, in number of sessions to keep for disputes. */
  export function set_dispute_period(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_period, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_period {
    return { type: "set_dispute_period", ...value }
  }
  /** Set the dispute post conclusion acceptance period. */
  export function set_dispute_post_conclusion_acceptance_period(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_post_conclusion_acceptance_period,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_post_conclusion_acceptance_period {
    return { type: "set_dispute_post_conclusion_acceptance_period", ...value }
  }
  /** Set the maximum number of dispute spam slots. */
  export function set_dispute_max_spam_slots(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_max_spam_slots,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_max_spam_slots {
    return { type: "set_dispute_max_spam_slots", ...value }
  }
  /** Set the dispute conclusion by time out period. */
  export function set_dispute_conclusion_by_time_out_period(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_conclusion_by_time_out_period,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_dispute_conclusion_by_time_out_period {
    return { type: "set_dispute_conclusion_by_time_out_period", ...value }
  }
  /**
   * Set the no show slots, in number of number of consensus slots.
   * Must be at least 1.
   */
  export function set_no_show_slots(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_no_show_slots, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_no_show_slots {
    return { type: "set_no_show_slots", ...value }
  }
  /** Set the total number of delay tranches. */
  export function set_n_delay_tranches(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_n_delay_tranches,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_n_delay_tranches {
    return { type: "set_n_delay_tranches", ...value }
  }
  /** Set the zeroth delay tranche width. */
  export function set_zeroth_delay_tranche_width(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_zeroth_delay_tranche_width,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_zeroth_delay_tranche_width {
    return { type: "set_zeroth_delay_tranche_width", ...value }
  }
  /** Set the number of validators needed to approve a block. */
  export function set_needed_approvals(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_needed_approvals,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_needed_approvals {
    return { type: "set_needed_approvals", ...value }
  }
  /** Set the number of samples to do of the `RelayVRFModulo` approval assignment criterion. */
  export function set_relay_vrf_modulo_samples(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_relay_vrf_modulo_samples,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_relay_vrf_modulo_samples {
    return { type: "set_relay_vrf_modulo_samples", ...value }
  }
  /** Sets the maximum items that can present in a upward dispatch queue at once. */
  export function set_max_upward_queue_count(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_count,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_count {
    return { type: "set_max_upward_queue_count", ...value }
  }
  /** Sets the maximum total size of items that can present in a upward dispatch queue at once. */
  export function set_max_upward_queue_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_queue_size {
    return { type: "set_max_upward_queue_size", ...value }
  }
  /** Set the critical downward message size. */
  export function set_max_downward_message_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_downward_message_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_downward_message_size {
    return { type: "set_max_downward_message_size", ...value }
  }
  /** Sets the soft limit for the phase of dispatching dispatchable upward messages. */
  export function set_ump_service_total_weight(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_service_total_weight,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_service_total_weight {
    return { type: "set_ump_service_total_weight", ...value }
  }
  /** Sets the maximum size of an upward message that can be sent by a candidate. */
  export function set_max_upward_message_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_size {
    return { type: "set_max_upward_message_size", ...value }
  }
  /** Sets the maximum number of messages that a candidate can contain. */
  export function set_max_upward_message_num_per_candidate(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_num_per_candidate,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_max_upward_message_num_per_candidate {
    return { type: "set_max_upward_message_num_per_candidate", ...value }
  }
  /** Sets the number of sessions after which an HRMP open channel request expires. */
  export function set_hrmp_open_request_ttl(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_open_request_ttl,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_open_request_ttl {
    return { type: "set_hrmp_open_request_ttl", ...value }
  }
  /** Sets the amount of funds that the sender should provide for opening an HRMP channel. */
  export function set_hrmp_sender_deposit(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_sender_deposit,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_sender_deposit {
    return { type: "set_hrmp_sender_deposit", ...value }
  }
  /**
   * Sets the amount of funds that the recipient should provide for accepting opening an HRMP
   * channel.
   */
  export function set_hrmp_recipient_deposit(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_recipient_deposit,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_recipient_deposit {
    return { type: "set_hrmp_recipient_deposit", ...value }
  }
  /** Sets the maximum number of messages allowed in an HRMP channel at once. */
  export function set_hrmp_channel_max_capacity(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_capacity,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_capacity {
    return { type: "set_hrmp_channel_max_capacity", ...value }
  }
  /** Sets the maximum total size of messages in bytes allowed in an HRMP channel at once. */
  export function set_hrmp_channel_max_total_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_total_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_total_size {
    return { type: "set_hrmp_channel_max_total_size", ...value }
  }
  /** Sets the maximum number of inbound HRMP channels a parachain is allowed to accept. */
  export function set_hrmp_max_parachain_inbound_channels(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_inbound_channels,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_inbound_channels {
    return { type: "set_hrmp_max_parachain_inbound_channels", ...value }
  }
  /** Sets the maximum number of inbound HRMP channels a parathread is allowed to accept. */
  export function set_hrmp_max_parathread_inbound_channels(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_inbound_channels,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_inbound_channels {
    return { type: "set_hrmp_max_parathread_inbound_channels", ...value }
  }
  /** Sets the maximum size of a message that could ever be put into an HRMP channel. */
  export function set_hrmp_channel_max_message_size(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_message_size,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_channel_max_message_size {
    return { type: "set_hrmp_channel_max_message_size", ...value }
  }
  /** Sets the maximum number of outbound HRMP channels a parachain is allowed to open. */
  export function set_hrmp_max_parachain_outbound_channels(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_outbound_channels,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parachain_outbound_channels {
    return { type: "set_hrmp_max_parachain_outbound_channels", ...value }
  }
  /** Sets the maximum number of outbound HRMP channels a parathread is allowed to open. */
  export function set_hrmp_max_parathread_outbound_channels(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_outbound_channels,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_parathread_outbound_channels {
    return { type: "set_hrmp_max_parathread_outbound_channels", ...value }
  }
  /** Sets the maximum number of outbound HRMP messages can be sent by a candidate. */
  export function set_hrmp_max_message_num_per_candidate(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_message_num_per_candidate,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_hrmp_max_message_num_per_candidate {
    return { type: "set_hrmp_max_message_num_per_candidate", ...value }
  }
  /** Sets the maximum amount of weight any individual upward message may consume. */
  export function set_ump_max_individual_weight(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_max_individual_weight,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_ump_max_individual_weight {
    return { type: "set_ump_max_individual_weight", ...value }
  }
  /** Enable or disable PVF pre-checking. Consult the field documentation prior executing. */
  export function set_pvf_checking_enabled(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_checking_enabled,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_checking_enabled {
    return { type: "set_pvf_checking_enabled", ...value }
  }
  /** Set the number of session changes after which a PVF pre-checking voting is rejected. */
  export function set_pvf_voting_ttl(
    value: Omit<t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_voting_ttl, "type">,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_pvf_voting_ttl {
    return { type: "set_pvf_voting_ttl", ...value }
  }
  /**
   * Sets the minimum delay between announcing the upgrade block for a parachain until the
   * upgrade taking place.
   *
   * See the field documentation for information and constraints for the new value.
   */
  export function set_minimum_validation_upgrade_delay(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_minimum_validation_upgrade_delay,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_minimum_validation_upgrade_delay {
    return { type: "set_minimum_validation_upgrade_delay", ...value }
  }
  /**
   * Setting this to true will disable consistency checks for the configuration setters.
   * Use with caution.
   */
  export function set_bypass_consistency_check(
    value: Omit<
      t.polkadot_runtime_parachains.configuration.pallet.Call.set_bypass_consistency_check,
      "type"
    >,
  ): t.polkadot_runtime_parachains.configuration.pallet.Call.set_bypass_consistency_check {
    return { type: "set_bypass_consistency_check", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "InvalidNewValue"
