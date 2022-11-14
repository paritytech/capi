import { $, C } from "../../../../../capi.ts"
import * as codecs from "../../../../../codecs.ts"
import type * as types from "../../../../mod.ts"

export interface Weight {
  normal: types.sp_weights.weight_v2.Weight
  operational: types.sp_weights.weight_v2.Weight
  mandatory: types.sp_weights.weight_v2.Weight
}

export function Weight(
  value: types.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight,
) {
  return value
}
