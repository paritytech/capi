import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $uncleEntryItem: $.Codec<t.types.pallet_authorship.UncleEntryItem> = _codec.$482

export type UncleEntryItem =
  | t.types.pallet_authorship.UncleEntryItem.InclusionHeight
  | t.types.pallet_authorship.UncleEntryItem.Uncle
export namespace UncleEntryItem {
  export interface InclusionHeight {
    type: "InclusionHeight"
    value: t.types.u32
  }
  export interface Uncle {
    type: "Uncle"
    value: [t.types.primitive_types.H256, t.types.sp_core.crypto.AccountId32 | undefined]
  }
  export function InclusionHeight(
    value: t.types.pallet_authorship.UncleEntryItem.InclusionHeight["value"],
  ): t.types.pallet_authorship.UncleEntryItem.InclusionHeight {
    return { type: "InclusionHeight", value }
  }
  export function Uncle(
    ...value: t.types.pallet_authorship.UncleEntryItem.Uncle["value"]
  ): t.types.pallet_authorship.UncleEntryItem.Uncle {
    return { type: "Uncle", value }
  }
}
