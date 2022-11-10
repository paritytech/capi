import { $ } from "../../../../../capi.ts"
import * as _codec from "../../../../../codecs.ts"
import type * as t from "../../../../../mod.ts"

export const $weight: $.Codec<
  t.types.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight
> = _codec.$7

export interface Weight {
  normal: t.types.sp_weights.weight_v2.Weight
  operational: t.types.sp_weights.weight_v2.Weight
  mandatory: t.types.sp_weights.weight_v2.Weight
}

export function Weight(
  value: t.types.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight,
) {
  return value
}
