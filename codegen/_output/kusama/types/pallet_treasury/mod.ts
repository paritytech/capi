import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $proposal: $.Codec<types.pallet_treasury.Proposal> = _codec.$556

export interface Proposal {
  proposer: types.sp_core.crypto.AccountId32
  value: types.u128
  beneficiary: types.sp_core.crypto.AccountId32
  bond: types.u128
}

export function Proposal(value: types.pallet_treasury.Proposal) {
  return value
}
