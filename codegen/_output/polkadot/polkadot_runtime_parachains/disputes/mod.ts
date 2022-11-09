import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $disputeLocation: $.Codec<t.polkadot_runtime_parachains.disputes.DisputeLocation> =
  _codec.$115

export const $disputeResult: $.Codec<t.polkadot_runtime_parachains.disputes.DisputeResult> =
  _codec.$116

export type DisputeLocation = "Local" | "Remote"

export type DisputeResult = "Valid" | "Invalid"

export * as pallet from "./pallet.ts"
