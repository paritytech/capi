import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface HostConfiguration {
  max_code_size: types.u32
  max_head_data_size: types.u32
  max_upward_queue_count: types.u32
  max_upward_queue_size: types.u32
  max_upward_message_size: types.u32
  max_upward_message_num_per_candidate: types.u32
  hrmp_max_message_num_per_candidate: types.u32
  validation_upgrade_cooldown: types.u32
  validation_upgrade_delay: types.u32
  max_pov_size: types.u32
  max_downward_message_size: types.u32
  ump_service_total_weight: types.sp_weights.weight_v2.Weight
  hrmp_max_parachain_outbound_channels: types.u32
  hrmp_max_parathread_outbound_channels: types.u32
  hrmp_sender_deposit: types.u128
  hrmp_recipient_deposit: types.u128
  hrmp_channel_max_capacity: types.u32
  hrmp_channel_max_total_size: types.u32
  hrmp_max_parachain_inbound_channels: types.u32
  hrmp_max_parathread_inbound_channels: types.u32
  hrmp_channel_max_message_size: types.u32
  code_retention_period: types.u32
  parathread_cores: types.u32
  parathread_retries: types.u32
  group_rotation_frequency: types.u32
  chain_availability_period: types.u32
  thread_availability_period: types.u32
  scheduling_lookahead: types.u32
  max_validators_per_core: types.u32 | undefined
  max_validators: types.u32 | undefined
  dispute_period: types.u32
  dispute_post_conclusion_acceptance_period: types.u32
  dispute_max_spam_slots: types.u32
  dispute_conclusion_by_time_out_period: types.u32
  no_show_slots: types.u32
  n_delay_tranches: types.u32
  zeroth_delay_tranche_width: types.u32
  needed_approvals: types.u32
  relay_vrf_modulo_samples: types.u32
  ump_max_individual_weight: types.sp_weights.weight_v2.Weight
  pvf_checking_enabled: boolean
  pvf_voting_ttl: types.u32
  minimum_validation_upgrade_delay: types.u32
}

export function HostConfiguration(
  value: types.polkadot_runtime_parachains.configuration.HostConfiguration,
) {
  return value
}
