import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $perU16: $.Codec<t.types.sp_arithmetic.per_things.PerU16> = _codec.$320

export const $perbill: $.Codec<t.types.sp_arithmetic.per_things.Perbill> = _codec.$42

export const $percent: $.Codec<t.types.sp_arithmetic.per_things.Percent> = _codec.$205

export const $permill: $.Codec<t.types.sp_arithmetic.per_things.Permill> = _codec.$558

export type PerU16 = t.types.u16

export function PerU16(value: t.types.sp_arithmetic.per_things.PerU16) {
  return value
}

export type Perbill = t.types.u32

export function Perbill(value: t.types.sp_arithmetic.per_things.Perbill) {
  return value
}

export type Percent = t.types.u8

export function Percent(value: t.types.sp_arithmetic.per_things.Percent) {
  return value
}

export type Permill = t.types.u32

export function Permill(value: t.types.sp_arithmetic.per_things.Permill) {
  return value
}
