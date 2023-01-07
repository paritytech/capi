import { $, C } from "../../../../../../capi.ts"
import * as codecs from "../../../../../../codecs.ts"
import type * as types from "../../../../../mod.ts"

export const $weight: $.Codec<
  types.frame_support.weights.PerDispatchClass.$$frame_support.weights.weight_v2.Weight
> = codecs.$7
export interface Weight {
  normal: types.frame_support.weights.weight_v2.Weight
  operational: types.frame_support.weights.weight_v2.Weight
  mandatory: types.frame_support.weights.weight_v2.Weight
}

export function Weight(
  value: types.frame_support.weights.PerDispatchClass.$$frame_support.weights.weight_v2.Weight,
) {
  return value
}
