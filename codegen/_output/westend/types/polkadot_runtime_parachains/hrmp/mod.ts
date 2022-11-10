import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as pallet from "./pallet.ts"

export const $hrmpChannel: $.Codec<t.types.polkadot_runtime_parachains.hrmp.HrmpChannel> =
  _codec.$688

export const $hrmpOpenChannelRequest: $.Codec<
  t.types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest
> = _codec.$686

export interface HrmpChannel {
  max_capacity: t.types.u32
  max_total_size: t.types.u32
  max_message_size: t.types.u32
  msg_count: t.types.u32
  total_size: t.types.u32
  mqc_head: t.types.primitive_types.H256 | undefined
  sender_deposit: t.types.u128
  recipient_deposit: t.types.u128
}

export function HrmpChannel(value: t.types.polkadot_runtime_parachains.hrmp.HrmpChannel) {
  return value
}

export interface HrmpOpenChannelRequest {
  confirmed: boolean
  _age: t.types.u32
  sender_deposit: t.types.u128
  max_message_size: t.types.u32
  max_capacity: t.types.u32
  max_total_size: t.types.u32
}

export function HrmpOpenChannelRequest(
  value: t.types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest,
) {
  return value
}
