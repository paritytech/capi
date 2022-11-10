import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as pallet from "./pallet.ts"

export const $hostConfiguration: $.Codec<
  t.types.polkadot_runtime_parachains.configuration.HostConfiguration
> = _codec.$638

export interface HostConfiguration {
  max_code_size: t.types.u32
  max_head_data_size: t.types.u32
  max_upward_queue_count: t.types.u32
  max_upward_queue_size: t.types.u32
  max_upward_message_size: t.types.u32
  max_upward_message_num_per_candidate: t.types.u32
  hrmp_max_message_num_per_candidate: t.types.u32
  validation_upgrade_cooldown: t.types.u32
  validation_upgrade_delay: t.types.u32
  max_pov_size: t.types.u32
  max_downward_message_size: t.types.u32
  ump_service_total_weight: t.types.sp_weights.weight_v2.Weight
  hrmp_max_parachain_outbound_channels: t.types.u32
  hrmp_max_parathread_outbound_channels: t.types.u32
  hrmp_sender_deposit: t.types.u128
  hrmp_recipient_deposit: t.types.u128
  hrmp_channel_max_capacity: t.types.u32
  hrmp_channel_max_total_size: t.types.u32
  hrmp_max_parachain_inbound_channels: t.types.u32
  hrmp_max_parathread_inbound_channels: t.types.u32
  hrmp_channel_max_message_size: t.types.u32
  code_retention_period: t.types.u32
  parathread_cores: t.types.u32
  parathread_retries: t.types.u32
  group_rotation_frequency: t.types.u32
  chain_availability_period: t.types.u32
  thread_availability_period: t.types.u32
  scheduling_lookahead: t.types.u32
  max_validators_per_core: t.types.u32 | undefined
  max_validators: t.types.u32 | undefined
  dispute_period: t.types.u32
  dispute_post_conclusion_acceptance_period: t.types.u32
  dispute_max_spam_slots: t.types.u32
  dispute_conclusion_by_time_out_period: t.types.u32
  no_show_slots: t.types.u32
  n_delay_tranches: t.types.u32
  zeroth_delay_tranche_width: t.types.u32
  needed_approvals: t.types.u32
  relay_vrf_modulo_samples: t.types.u32
  ump_max_individual_weight: t.types.sp_weights.weight_v2.Weight
  pvf_checking_enabled: boolean
  pvf_voting_ttl: t.types.u32
  minimum_validation_upgrade_delay: t.types.u32
}

export function HostConfiguration(
  value: t.types.polkadot_runtime_parachains.configuration.HostConfiguration,
) {
  return value
}
