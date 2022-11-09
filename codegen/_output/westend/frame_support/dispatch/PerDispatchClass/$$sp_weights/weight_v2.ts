import { $ } from "../../../../capi.ts"
import * as _codec from "../../../../codecs.ts"
import type * as t from "../../../../mod.ts"

export const $weight: $.Codec<
  t.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight
> = _codec.$7

export interface Weight {
  normal: t.sp_weights.weight_v2.Weight
  operational: t.sp_weights.weight_v2.Weight
  mandatory: t.sp_weights.weight_v2.Weight
}

export function Weight(
  value: t.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight,
) {
  return value
}
