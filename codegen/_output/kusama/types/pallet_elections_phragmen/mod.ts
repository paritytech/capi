import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export type Renouncing =
  | types.pallet_elections_phragmen.Renouncing.Member
  | types.pallet_elections_phragmen.Renouncing.RunnerUp
  | types.pallet_elections_phragmen.Renouncing.Candidate
export namespace Renouncing {
  export interface Member {
    type: "Member"
  }
  export interface RunnerUp {
    type: "RunnerUp"
  }
  export interface Candidate {
    type: "Candidate"
    value: types.Compact<types.u32>
  }
  export function Member(): types.pallet_elections_phragmen.Renouncing.Member {
    return { type: "Member" }
  }
  export function RunnerUp(): types.pallet_elections_phragmen.Renouncing.RunnerUp {
    return { type: "RunnerUp" }
  }
  export function Candidate(
    value: types.pallet_elections_phragmen.Renouncing.Candidate["value"],
  ): types.pallet_elections_phragmen.Renouncing.Candidate {
    return { type: "Candidate", value }
  }
}

export interface SeatHolder {
  who: types.sp_core.crypto.AccountId32
  stake: types.u128
  deposit: types.u128
}

export function SeatHolder(value: types.pallet_elections_phragmen.SeatHolder) {
  return value
}

export interface Voter {
  votes: Array<types.sp_core.crypto.AccountId32>
  stake: types.u128
  deposit: types.u128
}

export function Voter(value: types.pallet_elections_phragmen.Voter) {
  return value
}
