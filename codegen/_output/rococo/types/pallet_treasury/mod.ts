import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $proposal: $.Codec<t.types.pallet_treasury.Proposal> = _codec.$556

export interface Proposal {
  proposer: t.types.sp_core.crypto.AccountId32
  value: t.types.u128
  beneficiary: t.types.sp_core.crypto.AccountId32
  bond: t.types.u128
}

export function Proposal(value: t.types.pallet_treasury.Proposal) {
  return value
}
