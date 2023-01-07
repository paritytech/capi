import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $availabilityBitfieldRecord: $.Codec<
  types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord
> = codecs.$636
export interface AvailabilityBitfieldRecord {
  bitfield: types.polkadot_primitives.v2.AvailabilityBitfield
  submittedAt: types.u32
}

export function AvailabilityBitfieldRecord(
  value: types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord,
) {
  return value
}

export const $candidatePendingAvailability: $.Codec<
  types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability
> = codecs.$637
export interface CandidatePendingAvailability {
  core: types.polkadot_primitives.v2.CoreIndex
  hash: types.polkadot_core_primitives.CandidateHash
  descriptor: types.polkadot_primitives.v2.CandidateDescriptor
  availabilityVotes: $.BitSequence
  backers: $.BitSequence
  relayParentNumber: types.u32
  backedInNumber: types.u32
  backingGroup: types.polkadot_primitives.v2.GroupIndex
}

export function CandidatePendingAvailability(
  value: types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability,
) {
  return value
}
