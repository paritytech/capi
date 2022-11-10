import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as weight_v2 from "./weight_v2.ts"

export const $oldWeight: $.Codec<t.types.sp_weights.OldWeight> = _codec.$239

export const $runtimeDbWeight: $.Codec<t.types.sp_weights.RuntimeDbWeight> = _codec.$171

export type OldWeight = t.types.u64

export function OldWeight(value: t.types.sp_weights.OldWeight) {
  return value
}

export interface RuntimeDbWeight {
  read: t.types.u64
  write: t.types.u64
}

export function RuntimeDbWeight(value: t.types.sp_weights.RuntimeDbWeight) {
  return value
}
