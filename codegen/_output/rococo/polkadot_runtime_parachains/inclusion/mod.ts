import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $availabilityBitfieldRecord: $.Codec<
  t.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord
> = _codec.$644

export const $candidatePendingAvailability: $.Codec<
  t.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability
> = _codec.$645

export interface AvailabilityBitfieldRecord {
  bitfield: t.polkadot_primitives.v2.AvailabilityBitfield
  submitted_at: t.u32
}

export function AvailabilityBitfieldRecord(
  value: t.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord,
) {
  return value
}

export interface CandidatePendingAvailability {
  core: t.polkadot_primitives.v2.CoreIndex
  hash: t.polkadot_core_primitives.CandidateHash
  descriptor: t.polkadot_primitives.v2.CandidateDescriptor
  availability_votes: $.BitSequence
  backers: $.BitSequence
  relay_parent_number: t.u32
  backed_in_number: t.u32
  backing_group: t.polkadot_primitives.v2.GroupIndex
}

export function CandidatePendingAvailability(
  value: t.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability,
) {
  return value
}
