import { $, BitSequence, ChainError, Era } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $equivocationProof: $.Codec<t.sp_consensus_slots.EquivocationProof> = _codec.$186

export const $slot: $.Codec<t.sp_consensus_slots.Slot> = _codec.$190

export interface EquivocationProof {
  offender: t.sp_consensus_babe.app.Public
  slot: t.sp_consensus_slots.Slot
  first_header: t.sp_runtime.generic.header.Header
  second_header: t.sp_runtime.generic.header.Header
}

export function EquivocationProof(value: t.sp_consensus_slots.EquivocationProof) {
  return value
}

export type Slot = t.u64

export function Slot(value: t.sp_consensus_slots.Slot) {
  return value
}
