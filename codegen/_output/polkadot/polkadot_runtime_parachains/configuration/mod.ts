import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $hostConfiguration: $.Codec<
  t.polkadot_runtime_parachains.configuration.HostConfiguration
> = _codec.$638

export interface HostConfiguration {
  max_code_size: t.u32
  max_head_data_size: t.u32
  max_upward_queue_count: t.u32
  max_upward_queue_size: t.u32
  max_upward_message_size: t.u32
  max_upward_message_num_per_candidate: t.u32
  hrmp_max_message_num_per_candidate: t.u32
  validation_upgrade_cooldown: t.u32
  validation_upgrade_delay: t.u32
  max_pov_size: t.u32
  max_downward_message_size: t.u32
  ump_service_total_weight: t.sp_weights.weight_v2.Weight
  hrmp_max_parachain_outbound_channels: t.u32
  hrmp_max_parathread_outbound_channels: t.u32
  hrmp_sender_deposit: t.u128
  hrmp_recipient_deposit: t.u128
  hrmp_channel_max_capacity: t.u32
  hrmp_channel_max_total_size: t.u32
  hrmp_max_parachain_inbound_channels: t.u32
  hrmp_max_parathread_inbound_channels: t.u32
  hrmp_channel_max_message_size: t.u32
  code_retention_period: t.u32
  parathread_cores: t.u32
  parathread_retries: t.u32
  group_rotation_frequency: t.u32
  chain_availability_period: t.u32
  thread_availability_period: t.u32
  scheduling_lookahead: t.u32
  max_validators_per_core: t.u32 | undefined
  max_validators: t.u32 | undefined
  dispute_period: t.u32
  dispute_post_conclusion_acceptance_period: t.u32
  dispute_max_spam_slots: t.u32
  dispute_conclusion_by_time_out_period: t.u32
  no_show_slots: t.u32
  n_delay_tranches: t.u32
  zeroth_delay_tranche_width: t.u32
  needed_approvals: t.u32
  relay_vrf_modulo_samples: t.u32
  ump_max_individual_weight: t.sp_weights.weight_v2.Weight
  pvf_checking_enabled: boolean
  pvf_voting_ttl: t.u32
  minimum_validation_upgrade_delay: t.u32
}

export function HostConfiguration(
  value: t.polkadot_runtime_parachains.configuration.HostConfiguration,
) {
  return value
}
