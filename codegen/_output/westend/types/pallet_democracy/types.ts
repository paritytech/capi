import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface Delegations {
  votes: types.u128
  capital: types.u128
}

export function Delegations(value: types.pallet_democracy.types.Delegations) {
  return value
}

export type ReferendumInfo =
  | types.pallet_democracy.types.ReferendumInfo.Ongoing
  | types.pallet_democracy.types.ReferendumInfo.Finished
export namespace ReferendumInfo {
  export interface Ongoing {
    type: "Ongoing"
    value: types.pallet_democracy.types.ReferendumStatus
  }
  export interface Finished {
    type: "Finished"
    approved: boolean
    end: types.u32
  }
  export function Ongoing(
    value: types.pallet_democracy.types.ReferendumInfo.Ongoing["value"],
  ): types.pallet_democracy.types.ReferendumInfo.Ongoing {
    return { type: "Ongoing", value }
  }
  export function Finished(
    value: Omit<types.pallet_democracy.types.ReferendumInfo.Finished, "type">,
  ): types.pallet_democracy.types.ReferendumInfo.Finished {
    return { type: "Finished", ...value }
  }
}

export interface ReferendumStatus {
  end: types.u32
  proposal: types.frame_support.traits.preimages.Bounded
  threshold: types.pallet_democracy.vote_threshold.VoteThreshold
  delay: types.u32
  tally: types.pallet_democracy.types.Tally
}

export function ReferendumStatus(value: types.pallet_democracy.types.ReferendumStatus) {
  return value
}

export interface Tally {
  ayes: types.u128
  nays: types.u128
  turnout: types.u128
}

export function Tally(value: types.pallet_democracy.types.Tally) {
  return value
}
