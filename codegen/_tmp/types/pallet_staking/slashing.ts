import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $slashingSpans: $.Codec<types.pallet_staking.slashing.SlashingSpans> = codecs.$499
export interface SlashingSpans {
  spanIndex: types.u32
  lastStart: types.u32
  lastNonzeroSlash: types.u32
  prior: Array<types.u32>
}

export function SlashingSpans(value: types.pallet_staking.slashing.SlashingSpans) {
  return value
}

export const $spanRecord: $.Codec<types.pallet_staking.slashing.SpanRecord> = codecs.$500
export interface SpanRecord {
  slashed: types.u128
  paidOut: types.u128
}

export function SpanRecord(value: types.pallet_staking.slashing.SpanRecord) {
  return value
}
