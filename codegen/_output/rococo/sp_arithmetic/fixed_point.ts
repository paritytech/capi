import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $fixedU128: $.Codec<t.sp_arithmetic.fixed_point.FixedU128> = _codec.$479

export type FixedU128 = t.u128

export function FixedU128(value: t.sp_arithmetic.fixed_point.FixedU128) {
  return value
}
