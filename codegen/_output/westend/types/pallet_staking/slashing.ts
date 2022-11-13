import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $slashingSpans: $.Codec<types.pallet_staking.slashing.SlashingSpans> = _codec.$503

export const $spanRecord: $.Codec<types.pallet_staking.slashing.SpanRecord> = _codec.$504

export interface SlashingSpans {
  span_index: types.u32
  last_start: types.u32
  last_nonzero_slash: types.u32
  prior: Array<types.u32>
}

export function SlashingSpans(value: types.pallet_staking.slashing.SlashingSpans) {
  return value
}

export interface SpanRecord {
  slashed: types.u128
  paid_out: types.u128
}

export function SpanRecord(value: types.pallet_staking.slashing.SpanRecord) {
  return value
}
