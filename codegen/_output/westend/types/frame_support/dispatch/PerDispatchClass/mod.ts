import { $ } from "../../../../capi.ts"
import * as _codec from "../../../../codecs.ts"
import type * as t from "../../../../mod.ts"

export * as $$frame_system from "./$$frame_system/mod.ts"
export * as $$sp_weights from "./$$sp_weights/mod.ts"

export const $$$u32: $.Codec<t.types.frame_support.dispatch.PerDispatchClass.$$u32> = _codec.$170

export interface $$u32 {
  normal: t.types.u32
  operational: t.types.u32
  mandatory: t.types.u32
}

export function $$u32(value: t.types.frame_support.dispatch.PerDispatchClass.$$u32) {
  return value
}
