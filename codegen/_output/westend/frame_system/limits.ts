import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $blockLength: $.Codec<t.frame_system.limits.BlockLength> = _codec.$169

export const $blockWeights: $.Codec<t.frame_system.limits.BlockWeights> = _codec.$165

export const $weightsPerClass: $.Codec<t.frame_system.limits.WeightsPerClass> = _codec.$167

export interface BlockLength {
  max: t.frame_support.dispatch.PerDispatchClass.$$u32
}

export function BlockLength(value: t.frame_system.limits.BlockLength) {
  return value
}

export interface BlockWeights {
  base_block: t.sp_weights.weight_v2.Weight
  max_block: t.sp_weights.weight_v2.Weight
  per_class: t.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
}

export function BlockWeights(value: t.frame_system.limits.BlockWeights) {
  return value
}

export interface WeightsPerClass {
  base_extrinsic: t.sp_weights.weight_v2.Weight
  max_extrinsic: t.sp_weights.weight_v2.Weight | undefined
  max_total: t.sp_weights.weight_v2.Weight | undefined
  reserved: t.sp_weights.weight_v2.Weight | undefined
}

export function WeightsPerClass(value: t.frame_system.limits.WeightsPerClass) {
  return value
}
