import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $blockLength: $.Codec<types.frame_system.limits.BlockLength> = _codec.$169

export const $blockWeights: $.Codec<types.frame_system.limits.BlockWeights> = _codec.$165

export const $weightsPerClass: $.Codec<types.frame_system.limits.WeightsPerClass> = _codec.$167

export interface BlockLength {
  max: types.frame_support.dispatch.PerDispatchClass.$$u32
}

export function BlockLength(value: types.frame_system.limits.BlockLength) {
  return value
}

export interface BlockWeights {
  base_block: types.sp_weights.weight_v2.Weight
  max_block: types.sp_weights.weight_v2.Weight
  per_class: types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
}

export function BlockWeights(value: types.frame_system.limits.BlockWeights) {
  return value
}

export interface WeightsPerClass {
  base_extrinsic: types.sp_weights.weight_v2.Weight
  max_extrinsic: types.sp_weights.weight_v2.Weight | undefined
  max_total: types.sp_weights.weight_v2.Weight | undefined
  reserved: types.sp_weights.weight_v2.Weight | undefined
}

export function WeightsPerClass(value: types.frame_system.limits.WeightsPerClass) {
  return value
}
