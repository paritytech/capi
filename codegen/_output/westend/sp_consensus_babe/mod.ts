import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $allowedSlots: $.Codec<t.sp_consensus_babe.AllowedSlots> = _codec.$194

export const $babeEpochConfiguration: $.Codec<t.sp_consensus_babe.BabeEpochConfiguration> =
  _codec.$466

export type AllowedSlots =
  | "PrimarySlots"
  | "PrimaryAndSecondaryPlainSlots"
  | "PrimaryAndSecondaryVRFSlots"

export interface BabeEpochConfiguration {
  c: [t.u64, t.u64]
  allowed_slots: t.sp_consensus_babe.AllowedSlots
}

export function BabeEpochConfiguration(value: t.sp_consensus_babe.BabeEpochConfiguration) {
  return value
}

export * as app from "./app.ts"

export * as digests from "./digests.ts"
