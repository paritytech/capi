import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export interface EquivocationProof {
  offender: types.sp_consensus_babe.app.Public
  slot: types.sp_consensus_slots.Slot
  firstHeader: types.sp_runtime.generic.header.Header
  secondHeader: types.sp_runtime.generic.header.Header
}

export function EquivocationProof(value: types.sp_consensus_slots.EquivocationProof) {
  return value
}

export type Slot = types.u64

export function Slot(value: types.sp_consensus_slots.Slot) {
  return value
}
