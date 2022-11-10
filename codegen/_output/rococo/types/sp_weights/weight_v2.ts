import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $weight: $.Codec<t.types.sp_weights.weight_v2.Weight> = _codec.$8

export interface Weight {
  ref_time: t.Compact<t.types.u64>
  proof_size: t.Compact<t.types.u64>
}

export function Weight(value: t.types.sp_weights.weight_v2.Weight) {
  return value
}
