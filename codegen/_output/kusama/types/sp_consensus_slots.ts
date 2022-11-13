import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const $equivocationProof: $.Codec<types.sp_consensus_slots.EquivocationProof> = _codec.$186

export const $slot: $.Codec<types.sp_consensus_slots.Slot> = _codec.$190

export interface EquivocationProof {
  offender: types.sp_consensus_babe.app.Public
  slot: types.sp_consensus_slots.Slot
  first_header: types.sp_runtime.generic.header.Header
  second_header: types.sp_runtime.generic.header.Header
}

export function EquivocationProof(value: types.sp_consensus_slots.EquivocationProof) {
  return value
}

export type Slot = types.u64

export function Slot(value: types.sp_consensus_slots.Slot) {
  return value
}
