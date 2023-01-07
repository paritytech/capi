import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as app from "./app.ts"
export * as digests from "./digests.ts"

export const $allowedSlots: $.Codec<types.sp_consensus_babe.AllowedSlots> = codecs.$194
export type AllowedSlots =
  | "PrimarySlots"
  | "PrimaryAndSecondaryPlainSlots"
  | "PrimaryAndSecondaryVRFSlots"

export const $babeEpochConfiguration: $.Codec<types.sp_consensus_babe.BabeEpochConfiguration> =
  codecs.$463
export interface BabeEpochConfiguration {
  c: [types.u64, types.u64]
  allowedSlots: types.sp_consensus_babe.AllowedSlots
}

export function BabeEpochConfiguration(value: types.sp_consensus_babe.BabeEpochConfiguration) {
  return value
}
