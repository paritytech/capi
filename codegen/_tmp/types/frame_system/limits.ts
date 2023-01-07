import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $blockLength: $.Codec<types.frame_system.limits.BlockLength> = codecs.$169
export interface BlockLength {
  max: types.frame_support.weights.PerDispatchClass.$$u32
}

export function BlockLength(value: types.frame_system.limits.BlockLength) {
  return value
}

export const $blockWeights: $.Codec<types.frame_system.limits.BlockWeights> = codecs.$165
export interface BlockWeights {
  baseBlock: types.frame_support.weights.weight_v2.Weight
  maxBlock: types.frame_support.weights.weight_v2.Weight
  perClass: types.frame_support.weights.PerDispatchClass.$$frame_system.limits.WeightsPerClass
}

export function BlockWeights(value: types.frame_system.limits.BlockWeights) {
  return value
}

export const $weightsPerClass: $.Codec<types.frame_system.limits.WeightsPerClass> = codecs.$167
export interface WeightsPerClass {
  baseExtrinsic: types.frame_support.weights.weight_v2.Weight
  maxExtrinsic: types.frame_support.weights.weight_v2.Weight | undefined
  maxTotal: types.frame_support.weights.weight_v2.Weight | undefined
  reserved: types.frame_support.weights.weight_v2.Weight | undefined
}

export function WeightsPerClass(value: types.frame_system.limits.WeightsPerClass) {
  return value
}
