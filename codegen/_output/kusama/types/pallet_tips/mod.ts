import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $openTip: $.Codec<t.types.pallet_tips.OpenTip> = _codec.$598

export interface OpenTip {
  reason: t.types.primitive_types.H256
  who: t.types.sp_core.crypto.AccountId32
  finder: t.types.sp_core.crypto.AccountId32
  deposit: t.types.u128
  closes: t.types.u32 | undefined
  tips: Array<[t.types.sp_core.crypto.AccountId32, t.types.u128]>
  finders_fee: boolean
}

export function OpenTip(value: t.types.pallet_tips.OpenTip) {
  return value
}
