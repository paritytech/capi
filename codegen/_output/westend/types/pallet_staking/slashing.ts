import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

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
