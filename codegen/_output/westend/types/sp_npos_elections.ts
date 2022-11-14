import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export interface ElectionScore {
  minimal_stake: types.u128
  sum_stake: types.u128
  sum_stake_squared: types.u128
}

export function ElectionScore(value: types.sp_npos_elections.ElectionScore) {
  return value
}

export interface Support {
  total: types.u128
  voters: Array<[types.sp_core.crypto.AccountId32, types.u128]>
}

export function Support(value: types.sp_npos_elections.Support) {
  return value
}
