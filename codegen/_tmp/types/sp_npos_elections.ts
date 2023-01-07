import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export const $electionScore: $.Codec<types.sp_npos_elections.ElectionScore> = codecs.$89
export interface ElectionScore {
  minimalStake: types.u128
  sumStake: types.u128
  sumStakeSquared: types.u128
}

export function ElectionScore(value: types.sp_npos_elections.ElectionScore) {
  return value
}

export const $support: $.Codec<types.sp_npos_elections.Support> = codecs.$367
export interface Support {
  total: types.u128
  voters: Array<[types.sp_core.crypto.AccountId32, types.u128]>
}

export function Support(value: types.sp_npos_elections.Support) {
  return value
}
