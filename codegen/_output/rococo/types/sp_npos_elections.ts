import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const $electionScore: $.Codec<types.sp_npos_elections.ElectionScore> = _codec.$88

export const $support: $.Codec<types.sp_npos_elections.Support> = _codec.$367

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
