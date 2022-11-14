import { $, C } from "../../../../capi.ts"
import * as codecs from "../../../../codecs.ts"
import type * as types from "../../../mod.ts"

export * as $$frame_system from "./$$frame_system/mod.ts"
export * as $$sp_weights from "./$$sp_weights/mod.ts"

export interface $$u32 {
  normal: types.u32
  operational: types.u32
  mandatory: types.u32
}

export function $$u32(value: types.frame_support.dispatch.PerDispatchClass.$$u32) {
  return value
}
