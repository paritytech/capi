import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $perU16: $.Codec<types.sp_arithmetic.per_things.PerU16> = _codec.$320

export const $perbill: $.Codec<types.sp_arithmetic.per_things.Perbill> = _codec.$42

export const $percent: $.Codec<types.sp_arithmetic.per_things.Percent> = _codec.$205

export const $permill: $.Codec<types.sp_arithmetic.per_things.Permill> = _codec.$558

export type PerU16 = types.u16

export function PerU16(value: types.sp_arithmetic.per_things.PerU16) {
  return value
}

export type Perbill = types.u32

export function Perbill(value: types.sp_arithmetic.per_things.Perbill) {
  return value
}

export type Percent = types.u8

export function Percent(value: types.sp_arithmetic.per_things.Percent) {
  return value
}

export type Permill = types.u32

export function Permill(value: types.sp_arithmetic.per_things.Permill) {
  return value
}
