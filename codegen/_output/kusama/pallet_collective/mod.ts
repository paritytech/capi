import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $rawOrigin: $.Codec<t.pallet_collective.RawOrigin> = _codec.$258

export const $votes: $.Codec<t.pallet_collective.Votes> = _codec.$546

export type RawOrigin =
  | t.pallet_collective.RawOrigin.Members
  | t.pallet_collective.RawOrigin.Member
  | t.pallet_collective.RawOrigin._Phantom
export namespace RawOrigin {
  export interface Members {
    type: "Members"
    value: [t.u32, t.u32]
  }
  export interface Member {
    type: "Member"
    value: t.sp_core.crypto.AccountId32
  }
  export interface _Phantom {
    type: "_Phantom"
  }
  export function Members(
    ...value: t.pallet_collective.RawOrigin.Members["value"]
  ): t.pallet_collective.RawOrigin.Members {
    return { type: "Members", value }
  }
  export function Member(
    value: t.pallet_collective.RawOrigin.Member["value"],
  ): t.pallet_collective.RawOrigin.Member {
    return { type: "Member", value }
  }
  export function _Phantom(): t.pallet_collective.RawOrigin._Phantom {
    return { type: "_Phantom" }
  }
}

export interface Votes {
  index: t.u32
  threshold: t.u32
  ayes: Array<t.sp_core.crypto.AccountId32>
  nays: Array<t.sp_core.crypto.AccountId32>
  end: t.u32
}

export function Votes(value: t.pallet_collective.Votes) {
  return value
}
