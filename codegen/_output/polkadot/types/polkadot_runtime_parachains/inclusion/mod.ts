import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface AvailabilityBitfieldRecord {
  bitfield: types.polkadot_primitives.v2.AvailabilityBitfield
  submitted_at: types.u32
}

export function AvailabilityBitfieldRecord(
  value: types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord,
) {
  return value
}

export interface CandidatePendingAvailability {
  core: types.polkadot_primitives.v2.CoreIndex
  hash: types.polkadot_core_primitives.CandidateHash
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  availability_votes: $.BitSequence
  backers: $.BitSequence
  relay_parent_number: types.u32
  backed_in_number: types.u32
  backing_group: types.polkadot_primitives.v2.GroupIndex
}

export function CandidatePendingAvailability(
  value: types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability,
) {
  return value
}
