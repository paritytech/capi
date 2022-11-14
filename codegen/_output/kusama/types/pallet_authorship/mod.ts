import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export type UncleEntryItem =
  | types.pallet_authorship.UncleEntryItem.InclusionHeight
  | types.pallet_authorship.UncleEntryItem.Uncle
export namespace UncleEntryItem {
  export interface InclusionHeight {
    type: "InclusionHeight"
    value: types.u32
  }
  export interface Uncle {
    type: "Uncle"
    value: [types.primitive_types.H256, types.sp_core.crypto.AccountId32 | undefined]
  }
  export function InclusionHeight(
    value: types.pallet_authorship.UncleEntryItem.InclusionHeight["value"],
  ): types.pallet_authorship.UncleEntryItem.InclusionHeight {
    return { type: "InclusionHeight", value }
  }
  export function Uncle(
    ...value: types.pallet_authorship.UncleEntryItem.Uncle["value"]
  ): types.pallet_authorship.UncleEntryItem.Uncle {
    return { type: "Uncle", value }
  }
}
