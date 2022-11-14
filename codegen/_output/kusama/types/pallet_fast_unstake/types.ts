import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface UnstakeRequest {
  stash: types.sp_core.crypto.AccountId32
  checked: Array<types.u32>
  deposit: types.u128
}

export function UnstakeRequest(value: types.pallet_fast_unstake.types.UnstakeRequest) {
  return value
}
