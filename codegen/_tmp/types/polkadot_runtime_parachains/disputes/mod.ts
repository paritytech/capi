import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $disputeLocation: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeLocation> =
  codecs.$114
export type DisputeLocation = "Local" | "Remote"

export const $disputeResult: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeResult> =
  codecs.$115
export type DisputeResult = "Valid" | "Invalid"
