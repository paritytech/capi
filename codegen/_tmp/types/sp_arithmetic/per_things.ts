import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $perU16: $.Codec<types.sp_arithmetic.per_things.PerU16> = codecs.$320
export type PerU16 = types.u16

export function PerU16(value: types.sp_arithmetic.per_things.PerU16) {
  return value
}

export const $perbill: $.Codec<types.sp_arithmetic.per_things.Perbill> = codecs.$42
export type Perbill = types.u32

export function Perbill(value: types.sp_arithmetic.per_things.Perbill) {
  return value
}

export const $percent: $.Codec<types.sp_arithmetic.per_things.Percent> = codecs.$205
export type Percent = types.u8

export function Percent(value: types.sp_arithmetic.per_things.Percent) {
  return value
}

export const $permill: $.Codec<types.sp_arithmetic.per_things.Permill> = codecs.$553
export type Permill = types.u32

export function Permill(value: types.sp_arithmetic.per_things.Permill) {
  return value
}
