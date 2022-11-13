import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as weight_v2 from "./weight_v2.ts"

export const $oldWeight: $.Codec<types.sp_weights.OldWeight> = _codec.$239

export const $runtimeDbWeight: $.Codec<types.sp_weights.RuntimeDbWeight> = _codec.$171

export type OldWeight = types.u64

export function OldWeight(value: types.sp_weights.OldWeight) {
  return value
}

export interface RuntimeDbWeight {
  read: types.u64
  write: types.u64
}

export function RuntimeDbWeight(value: types.sp_weights.RuntimeDbWeight) {
  return value
}
