import { $ } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $electionScore: $.Codec<t.sp_npos_elections.ElectionScore> = _codec.$88

export const $support: $.Codec<t.sp_npos_elections.Support> = _codec.$367

export interface ElectionScore {
  minimal_stake: t.u128
  sum_stake: t.u128
  sum_stake_squared: t.u128
}

export function ElectionScore(value: t.sp_npos_elections.ElectionScore) {
  return value
}

export interface Support {
  total: t.u128
  voters: Array<[t.sp_core.crypto.AccountId32, t.u128]>
}

export function Support(value: t.sp_npos_elections.Support) {
  return value
}
