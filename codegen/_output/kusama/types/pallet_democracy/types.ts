import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $delegations: $.Codec<t.types.pallet_democracy.types.Delegations> = _codec.$540

export const $referendumInfo: $.Codec<t.types.pallet_democracy.types.ReferendumInfo> = _codec.$533

export const $referendumStatus: $.Codec<t.types.pallet_democracy.types.ReferendumStatus> =
  _codec.$534

export const $tally: $.Codec<t.types.pallet_democracy.types.Tally> = _codec.$535

export interface Delegations {
  votes: t.types.u128
  capital: t.types.u128
}

export function Delegations(value: t.types.pallet_democracy.types.Delegations) {
  return value
}

export type ReferendumInfo =
  | t.types.pallet_democracy.types.ReferendumInfo.Ongoing
  | t.types.pallet_democracy.types.ReferendumInfo.Finished
export namespace ReferendumInfo {
  export interface Ongoing {
    type: "Ongoing"
    value: t.types.pallet_democracy.types.ReferendumStatus
  }
  export interface Finished {
    type: "Finished"
    approved: boolean
    end: t.types.u32
  }
  export function Ongoing(
    value: t.types.pallet_democracy.types.ReferendumInfo.Ongoing["value"],
  ): t.types.pallet_democracy.types.ReferendumInfo.Ongoing {
    return { type: "Ongoing", value }
  }
  export function Finished(
    value: Omit<t.types.pallet_democracy.types.ReferendumInfo.Finished, "type">,
  ): t.types.pallet_democracy.types.ReferendumInfo.Finished {
    return { type: "Finished", ...value }
  }
}

export interface ReferendumStatus {
  end: t.types.u32
  proposal: t.types.frame_support.traits.preimages.Bounded
  threshold: t.types.pallet_democracy.vote_threshold.VoteThreshold
  delay: t.types.u32
  tally: t.types.pallet_democracy.types.Tally
}

export function ReferendumStatus(value: t.types.pallet_democracy.types.ReferendumStatus) {
  return value
}

export interface Tally {
  ayes: t.types.u128
  nays: t.types.u128
  turnout: t.types.u128
}

export function Tally(value: t.types.pallet_democracy.types.Tally) {
  return value
}
