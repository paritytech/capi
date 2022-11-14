import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as weight_v2 from "./weight_v2.ts"

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
