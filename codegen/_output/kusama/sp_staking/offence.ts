import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $offenceDetails: $.Codec<t.sp_staking.offence.OffenceDetails> = _codec.$509

export interface OffenceDetails {
  offender: [t.sp_core.crypto.AccountId32, t.pallet_staking.Exposure]
  reporters: Array<t.sp_core.crypto.AccountId32>
}

export function OffenceDetails(value: t.sp_staking.offence.OffenceDetails) {
  return value
}
