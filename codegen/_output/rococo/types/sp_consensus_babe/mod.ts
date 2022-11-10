import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as app from "./app.ts"
export * as digests from "./digests.ts"

export const $allowedSlots: $.Codec<t.types.sp_consensus_babe.AllowedSlots> = _codec.$194

export const $babeEpochConfiguration: $.Codec<t.types.sp_consensus_babe.BabeEpochConfiguration> =
  _codec.$466

export type AllowedSlots =
  | "PrimarySlots"
  | "PrimaryAndSecondaryPlainSlots"
  | "PrimaryAndSecondaryVRFSlots"

export interface BabeEpochConfiguration {
  c: [t.types.u64, t.types.u64]
  allowed_slots: t.types.sp_consensus_babe.AllowedSlots
}

export function BabeEpochConfiguration(value: t.types.sp_consensus_babe.BabeEpochConfiguration) {
  return value
}
