import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $perU16: $.Codec<t.sp_arithmetic.per_things.PerU16> = _codec.$320

export const $perbill: $.Codec<t.sp_arithmetic.per_things.Perbill> = _codec.$42

export const $percent: $.Codec<t.sp_arithmetic.per_things.Percent> = _codec.$205

export const $permill: $.Codec<t.sp_arithmetic.per_things.Permill> = _codec.$558

export type PerU16 = t.u16

export function PerU16(value: t.sp_arithmetic.per_things.PerU16) {
  return value
}

export type Perbill = t.u32

export function Perbill(value: t.sp_arithmetic.per_things.Perbill) {
  return value
}

export type Percent = t.u8

export function Percent(value: t.sp_arithmetic.per_things.Percent) {
  return value
}

export type Permill = t.u32

export function Permill(value: t.sp_arithmetic.per_things.Permill) {
  return value
}
