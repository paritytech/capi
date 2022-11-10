import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $rawOrigin: $.Codec<t.types.pallet_collective.RawOrigin> = _codec.$258

export const $votes: $.Codec<t.types.pallet_collective.Votes> = _codec.$546

export type RawOrigin =
  | t.types.pallet_collective.RawOrigin.Members
  | t.types.pallet_collective.RawOrigin.Member
  | t.types.pallet_collective.RawOrigin._Phantom
export namespace RawOrigin {
  export interface Members {
    type: "Members"
    value: [t.types.u32, t.types.u32]
  }
  export interface Member {
    type: "Member"
    value: t.types.sp_core.crypto.AccountId32
  }
  export interface _Phantom {
    type: "_Phantom"
  }
  export function Members(
    ...value: t.types.pallet_collective.RawOrigin.Members["value"]
  ): t.types.pallet_collective.RawOrigin.Members {
    return { type: "Members", value }
  }
  export function Member(
    value: t.types.pallet_collective.RawOrigin.Member["value"],
  ): t.types.pallet_collective.RawOrigin.Member {
    return { type: "Member", value }
  }
  export function _Phantom(): t.types.pallet_collective.RawOrigin._Phantom {
    return { type: "_Phantom" }
  }
}

export interface Votes {
  index: t.types.u32
  threshold: t.types.u32
  ayes: Array<t.types.sp_core.crypto.AccountId32>
  nays: Array<t.types.sp_core.crypto.AccountId32>
  end: t.types.u32
}

export function Votes(value: t.types.pallet_collective.Votes) {
  return value
}
