import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $unstakeRequest: $.Codec<t.pallet_fast_unstake.types.UnstakeRequest> = _codec.$634

export interface UnstakeRequest {
  stash: t.sp_core.crypto.AccountId32
  checked: Array<t.u32>
  deposit: t.u128
}

export function UnstakeRequest(value: t.pallet_fast_unstake.types.UnstakeRequest) {
  return value
}
