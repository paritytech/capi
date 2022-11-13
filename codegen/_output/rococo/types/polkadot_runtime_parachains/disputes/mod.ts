import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $disputeLocation: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeLocation> =
  _codec.$115

export const $disputeResult: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeResult> =
  _codec.$116

export type DisputeLocation = "Local" | "Remote"

export type DisputeResult = "Valid" | "Invalid"
