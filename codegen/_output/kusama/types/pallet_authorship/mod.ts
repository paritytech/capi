import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $uncleEntryItem: $.Codec<types.pallet_authorship.UncleEntryItem> = _codec.$482

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
