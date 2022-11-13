import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $weight: $.Codec<types.sp_weights.weight_v2.Weight> = _codec.$8

export interface Weight {
  ref_time: types.Compact<types.u64>
  proof_size: types.Compact<types.u64>
}

export function Weight(value: types.sp_weights.weight_v2.Weight) {
  return value
}
