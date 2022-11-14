import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as app from "./app.ts"
export * as digests from "./digests.ts"

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
