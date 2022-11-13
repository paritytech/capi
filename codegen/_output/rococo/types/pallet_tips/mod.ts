import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $openTip: $.Codec<types.pallet_tips.OpenTip> = _codec.$598

export interface OpenTip {
  reason: types.primitive_types.H256
  who: types.sp_core.crypto.AccountId32
  finder: types.sp_core.crypto.AccountId32
  deposit: types.u128
  closes: types.u32 | undefined
  tips: Array<[types.sp_core.crypto.AccountId32, types.u128]>
  finders_fee: boolean
}

export function OpenTip(value: types.pallet_tips.OpenTip) {
  return value
}
