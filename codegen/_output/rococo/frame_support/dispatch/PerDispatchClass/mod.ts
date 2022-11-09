import { $, BitSequence, ChainError, Era } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"
export const $$$u32: $.Codec<t.frame_support.dispatch.PerDispatchClass.$$u32> = _codec.$170

export * as $$frame_system from "./$$frame_system/mod.ts"

export * as $$sp_weights from "./$$sp_weights/mod.ts"

export interface $$u32 {
  normal: t.u32
  operational: t.u32
  mandatory: t.u32
}

export function $$u32(value: t.frame_support.dispatch.PerDispatchClass.$$u32) {
  return value
}
