import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $slashingSpans: $.Codec<t.types.pallet_staking.slashing.SlashingSpans> = _codec.$503

export const $spanRecord: $.Codec<t.types.pallet_staking.slashing.SpanRecord> = _codec.$504

export interface SlashingSpans {
  span_index: t.types.u32
  last_start: t.types.u32
  last_nonzero_slash: t.types.u32
  prior: Array<t.types.u32>
}

export function SlashingSpans(value: t.types.pallet_staking.slashing.SlashingSpans) {
  return value
}

export interface SpanRecord {
  slashed: t.types.u128
  paid_out: t.types.u128
}

export function SpanRecord(value: t.types.pallet_staking.slashing.SpanRecord) {
  return value
}
