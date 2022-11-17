import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface HrmpChannel {
  maxCapacity: types.u32
  maxTotalSize: types.u32
  maxMessageSize: types.u32
  msgCount: types.u32
  totalSize: types.u32
  mqcHead: types.primitive_types.H256 | undefined
  senderDeposit: types.u128
  recipientDeposit: types.u128
}

export function HrmpChannel(value: types.polkadot_runtime_parachains.hrmp.HrmpChannel) {
  return value
}

export interface HrmpOpenChannelRequest {
  confirmed: boolean
  Age: types.u32
  senderDeposit: types.u128
  maxMessageSize: types.u32
  maxCapacity: types.u32
  maxTotalSize: types.u32
}

export function HrmpOpenChannelRequest(
  value: types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest,
) {
  return value
}
