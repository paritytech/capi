import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $fixedU128: $.Codec<types.sp_arithmetic.fixed_point.FixedU128> = _codec.$479

export type FixedU128 = types.u128

export function FixedU128(value: types.sp_arithmetic.fixed_point.FixedU128) {
  return value
}
