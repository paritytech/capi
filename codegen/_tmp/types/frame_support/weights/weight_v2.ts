import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $weight: $.Codec<types.frame_support.weights.weight_v2.Weight> = codecs.$8
export interface Weight {
  refTime: types.u64
}

export function Weight(value: types.frame_support.weights.weight_v2.Weight) {
  return value
}
