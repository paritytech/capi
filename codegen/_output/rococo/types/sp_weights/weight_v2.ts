import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface Weight {
  ref_time: types.Compact<types.u64>
  proof_size: types.Compact<types.u64>
}

export function Weight(value: types.sp_weights.weight_v2.Weight) {
  return value
}
