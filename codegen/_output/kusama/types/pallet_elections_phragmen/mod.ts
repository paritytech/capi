import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $renouncing: $.Codec<t.types.pallet_elections_phragmen.Renouncing> = _codec.$242

export const $seatHolder: $.Codec<t.types.pallet_elections_phragmen.SeatHolder> = _codec.$551

export const $voter: $.Codec<t.types.pallet_elections_phragmen.Voter> = _codec.$552

export type Renouncing =
  | t.types.pallet_elections_phragmen.Renouncing.Member
  | t.types.pallet_elections_phragmen.Renouncing.RunnerUp
  | t.types.pallet_elections_phragmen.Renouncing.Candidate
export namespace Renouncing {
  export interface Member {
    type: "Member"
  }
  export interface RunnerUp {
    type: "RunnerUp"
  }
  export interface Candidate {
    type: "Candidate"
    value: t.Compact<t.types.u32>
  }
  export function Member(): t.types.pallet_elections_phragmen.Renouncing.Member {
    return { type: "Member" }
  }
  export function RunnerUp(): t.types.pallet_elections_phragmen.Renouncing.RunnerUp {
    return { type: "RunnerUp" }
  }
  export function Candidate(
    value: t.types.pallet_elections_phragmen.Renouncing.Candidate["value"],
  ): t.types.pallet_elections_phragmen.Renouncing.Candidate {
    return { type: "Candidate", value }
  }
}

export interface SeatHolder {
  who: t.types.sp_core.crypto.AccountId32
  stake: t.types.u128
  deposit: t.types.u128
}

export function SeatHolder(value: t.types.pallet_elections_phragmen.SeatHolder) {
  return value
}

export interface Voter {
  votes: Array<t.types.sp_core.crypto.AccountId32>
  stake: t.types.u128
  deposit: t.types.u128
}

export function Voter(value: t.types.pallet_elections_phragmen.Voter) {
  return value
}
