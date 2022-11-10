import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $electionScore: $.Codec<t.types.sp_npos_elections.ElectionScore> = _codec.$88

export const $support: $.Codec<t.types.sp_npos_elections.Support> = _codec.$367

export interface ElectionScore {
  minimal_stake: t.types.u128
  sum_stake: t.types.u128
  sum_stake_squared: t.types.u128
}

export function ElectionScore(value: t.types.sp_npos_elections.ElectionScore) {
  return value
}

export interface Support {
  total: t.types.u128
  voters: Array<[t.types.sp_core.crypto.AccountId32, t.types.u128]>
}

export function Support(value: t.types.sp_npos_elections.Support) {
  return value
}
