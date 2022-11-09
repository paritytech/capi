import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $proposal: $.Codec<t.pallet_treasury.Proposal> = _codec.$556

export interface Proposal {
  proposer: t.sp_core.crypto.AccountId32
  value: t.u128
  beneficiary: t.sp_core.crypto.AccountId32
  bond: t.u128
}

export function Proposal(value: t.pallet_treasury.Proposal) {
  return value
}
