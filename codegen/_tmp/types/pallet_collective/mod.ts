import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $rawOrigin: $.Codec<types.pallet_collective.RawOrigin> = codecs.$258
export type RawOrigin =
  | types.pallet_collective.RawOrigin.Members
  | types.pallet_collective.RawOrigin.Member
  | types.pallet_collective.RawOrigin.Phantom
export namespace RawOrigin {
  export interface Members {
    type: "Members"
    value: [types.u32, types.u32]
  }
  export interface Member {
    type: "Member"
    value: types.sp_core.crypto.AccountId32
  }
  export interface Phantom {
    type: "Phantom"
  }
  export function Members(
    ...value: types.pallet_collective.RawOrigin.Members["value"]
  ): types.pallet_collective.RawOrigin.Members {
    return { type: "Members", value }
  }
  export function Member(
    value: types.pallet_collective.RawOrigin.Member["value"],
  ): types.pallet_collective.RawOrigin.Member {
    return { type: "Member", value }
  }
  export function Phantom(): types.pallet_collective.RawOrigin.Phantom {
    return { type: "Phantom" }
  }
}

export const $votes: $.Codec<types.pallet_collective.Votes> = codecs.$541
export interface Votes {
  index: types.u32
  threshold: types.u32
  ayes: Array<types.sp_core.crypto.AccountId32>
  nays: Array<types.sp_core.crypto.AccountId32>
  end: types.u32
}

export function Votes(value: types.pallet_collective.Votes) {
  return value
}
