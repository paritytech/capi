import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $offenceDetails: $.Codec<t.types.sp_staking.offence.OffenceDetails> = _codec.$509

export interface OffenceDetails {
  offender: [t.types.sp_core.crypto.AccountId32, t.types.pallet_staking.Exposure]
  reporters: Array<t.types.sp_core.crypto.AccountId32>
}

export function OffenceDetails(value: t.types.sp_staking.offence.OffenceDetails) {
  return value
}
