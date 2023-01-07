import { $, C } from "../../../../capi.ts"
import * as codecs from "../../../../codecs.ts"
import type * as types from "../../../mod.ts"

export * as $$frame_support from "./$$frame_support/mod.ts"
export * as $$frame_system from "./$$frame_system/mod.ts"

export const $$$u32: $.Codec<types.frame_support.weights.PerDispatchClass.$$u32> = codecs.$170
export interface $$u32 {
  normal: types.u32
  operational: types.u32
  mandatory: types.u32
}

export function $$u32(value: types.frame_support.weights.PerDispatchClass.$$u32) {
  return value
}
