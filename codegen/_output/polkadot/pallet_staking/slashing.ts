import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $slashingSpans: $.Codec<t.pallet_staking.slashing.SlashingSpans> = _codec.$503

export const $spanRecord: $.Codec<t.pallet_staking.slashing.SpanRecord> = _codec.$504

export interface SlashingSpans {
  span_index: t.u32
  last_start: t.u32
  last_nonzero_slash: t.u32
  prior: Array<t.u32>
}

export function SlashingSpans(value: t.pallet_staking.slashing.SlashingSpans) {
  return value
}

export interface SpanRecord {
  slashed: t.u128
  paid_out: t.u128
}

export function SpanRecord(value: t.pallet_staking.slashing.SpanRecord) {
  return value
}
