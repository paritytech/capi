import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $unstakeRequest: $.Codec<t.types.pallet_fast_unstake.types.UnstakeRequest> =
  _codec.$634

export interface UnstakeRequest {
  stash: t.types.sp_core.crypto.AccountId32
  checked: Array<t.types.u32>
  deposit: t.types.u128
}

export function UnstakeRequest(value: t.types.pallet_fast_unstake.types.UnstakeRequest) {
  return value
}
