import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $hrmpChannel: $.Codec<types.polkadot_runtime_parachains.hrmp.HrmpChannel> = _codec.$688

export const $hrmpOpenChannelRequest: $.Codec<
  types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest
> = _codec.$686

export interface HrmpChannel {
  max_capacity: types.u32
  max_total_size: types.u32
  max_message_size: types.u32
  msg_count: types.u32
  total_size: types.u32
  mqc_head: types.primitive_types.H256 | undefined
  sender_deposit: types.u128
  recipient_deposit: types.u128
}

export function HrmpChannel(value: types.polkadot_runtime_parachains.hrmp.HrmpChannel) {
  return value
}

export interface HrmpOpenChannelRequest {
  confirmed: boolean
  _age: types.u32
  sender_deposit: types.u128
  max_message_size: types.u32
  max_capacity: types.u32
  max_total_size: types.u32
}

export function HrmpOpenChannelRequest(
  value: types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest,
) {
  return value
}
