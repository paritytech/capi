import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $proposal: $.Codec<types.pallet_treasury.Proposal> = codecs.$551
export interface Proposal {
  proposer: types.sp_core.crypto.AccountId32
  value: types.u128
  beneficiary: types.sp_core.crypto.AccountId32
  bond: types.u128
}

export function Proposal(value: types.pallet_treasury.Proposal) {
  return value
}
