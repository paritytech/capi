import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export type RawOrigin =
  | types.pallet_collective.RawOrigin.Members
  | types.pallet_collective.RawOrigin.Member
  | types.pallet_collective.RawOrigin._Phantom
export namespace RawOrigin {
  export interface Members {
    type: "Members"
    value: [types.u32, types.u32]
  }
  export interface Member {
    type: "Member"
    value: types.sp_core.crypto.AccountId32
  }
  export interface _Phantom {
    type: "_Phantom"
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
  export function _Phantom(): types.pallet_collective.RawOrigin._Phantom {
    return { type: "_Phantom" }
  }
}

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
