import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $uncleEntryItem: $.Codec<t.pallet_authorship.UncleEntryItem> = _codec.$482

export type UncleEntryItem =
  | t.pallet_authorship.UncleEntryItem.InclusionHeight
  | t.pallet_authorship.UncleEntryItem.Uncle
export namespace UncleEntryItem {
  export interface InclusionHeight {
    type: "InclusionHeight"
    value: t.u32
  }
  export interface Uncle {
    type: "Uncle"
    value: [t.primitive_types.H256, t.sp_core.crypto.AccountId32 | undefined]
  }
  export function InclusionHeight(
    value: t.pallet_authorship.UncleEntryItem.InclusionHeight["value"],
  ): t.pallet_authorship.UncleEntryItem.InclusionHeight {
    return { type: "InclusionHeight", value }
  }
  export function Uncle(
    ...value: t.pallet_authorship.UncleEntryItem.Uncle["value"]
  ): t.pallet_authorship.UncleEntryItem.Uncle {
    return { type: "Uncle", value }
  }
}

export * as pallet from "./pallet.ts"
