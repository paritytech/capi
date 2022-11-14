import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type FixedU128 = types.u128

export function FixedU128(value: types.sp_arithmetic.fixed_point.FixedU128) {
  return value
}
