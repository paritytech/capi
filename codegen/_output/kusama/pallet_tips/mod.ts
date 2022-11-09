import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $openTip: $.Codec<t.pallet_tips.OpenTip> = _codec.$598

export interface OpenTip {
  reason: t.primitive_types.H256
  who: t.sp_core.crypto.AccountId32
  finder: t.sp_core.crypto.AccountId32
  deposit: t.u128
  closes: t.u32 | undefined
  tips: Array<[t.sp_core.crypto.AccountId32, t.u128]>
  finders_fee: boolean
}

export function OpenTip(value: t.pallet_tips.OpenTip) {
  return value
}
