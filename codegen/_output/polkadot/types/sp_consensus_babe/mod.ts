import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as app from "./app.ts"
export * as digests from "./digests.ts"

export const $allowedSlots: $.Codec<types.sp_consensus_babe.AllowedSlots> = _codec.$194

export const $babeEpochConfiguration: $.Codec<types.sp_consensus_babe.BabeEpochConfiguration> =
  _codec.$466

export type AllowedSlots =
  | "PrimarySlots"
  | "PrimaryAndSecondaryPlainSlots"
  | "PrimaryAndSecondaryVRFSlots"

export interface BabeEpochConfiguration {
  c: [types.u64, types.u64]
  allowed_slots: types.sp_consensus_babe.AllowedSlots
}

export function BabeEpochConfiguration(value: types.sp_consensus_babe.BabeEpochConfiguration) {
  return value
}
