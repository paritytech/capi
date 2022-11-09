import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $delegations: $.Codec<t.pallet_democracy.types.Delegations> = _codec.$540

export const $referendumInfo: $.Codec<t.pallet_democracy.types.ReferendumInfo> = _codec.$533

export const $referendumStatus: $.Codec<t.pallet_democracy.types.ReferendumStatus> = _codec.$534

export const $tally: $.Codec<t.pallet_democracy.types.Tally> = _codec.$535

export interface Delegations {
  votes: t.u128
  capital: t.u128
}

export function Delegations(value: t.pallet_democracy.types.Delegations) {
  return value
}

export type ReferendumInfo =
  | t.pallet_democracy.types.ReferendumInfo.Ongoing
  | t.pallet_democracy.types.ReferendumInfo.Finished
export namespace ReferendumInfo {
  export interface Ongoing {
    type: "Ongoing"
    value: t.pallet_democracy.types.ReferendumStatus
  }
  export interface Finished {
    type: "Finished"
    approved: boolean
    end: t.u32
  }
  export function Ongoing(
    value: t.pallet_democracy.types.ReferendumInfo.Ongoing["value"],
  ): t.pallet_democracy.types.ReferendumInfo.Ongoing {
    return { type: "Ongoing", value }
  }
  export function Finished(
    value: Omit<t.pallet_democracy.types.ReferendumInfo.Finished, "type">,
  ): t.pallet_democracy.types.ReferendumInfo.Finished {
    return { type: "Finished", ...value }
  }
}

export interface ReferendumStatus {
  end: t.u32
  proposal: t.frame_support.traits.preimages.Bounded
  threshold: t.pallet_democracy.vote_threshold.VoteThreshold
  delay: t.u32
  tally: t.pallet_democracy.types.Tally
}

export function ReferendumStatus(value: t.pallet_democracy.types.ReferendumStatus) {
  return value
}

export interface Tally {
  ayes: t.u128
  nays: t.u128
  turnout: t.u128
}

export function Tally(value: t.pallet_democracy.types.Tally) {
  return value
}
