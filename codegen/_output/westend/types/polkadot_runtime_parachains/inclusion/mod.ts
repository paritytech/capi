import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as pallet from "./pallet.ts"

export const $availabilityBitfieldRecord: $.Codec<
  t.types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord
> = _codec.$644

export const $candidatePendingAvailability: $.Codec<
  t.types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability
> = _codec.$645

export interface AvailabilityBitfieldRecord {
  bitfield: t.types.polkadot_primitives.v2.AvailabilityBitfield
  submitted_at: t.types.u32
}

export function AvailabilityBitfieldRecord(
  value: t.types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord,
) {
  return value
}

export interface CandidatePendingAvailability {
  core: t.types.polkadot_primitives.v2.CoreIndex
  hash: t.types.polkadot_core_primitives.CandidateHash
  descriptor: t.types.polkadot_primitives.v2.CandidateDescriptor
  availability_votes: $.BitSequence
  backers: $.BitSequence
  relay_parent_number: t.types.u32
  backed_in_number: t.types.u32
  backing_group: t.types.polkadot_primitives.v2.GroupIndex
}

export function CandidatePendingAvailability(
  value: t.types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability,
) {
  return value
}
