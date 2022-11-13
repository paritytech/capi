import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $offenceDetails: $.Codec<types.sp_staking.offence.OffenceDetails> = _codec.$509

export interface OffenceDetails {
  offender: [types.sp_core.crypto.AccountId32, types.pallet_staking.Exposure]
  reporters: Array<types.sp_core.crypto.AccountId32>
}

export function OffenceDetails(value: types.sp_staking.offence.OffenceDetails) {
  return value
}
