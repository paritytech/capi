import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $signedSubmission: $.Codec<
  types.pallet_election_provider_multi_phase.signed.SignedSubmission
> = _codec.$610

export interface SignedSubmission {
  who: types.sp_core.crypto.AccountId32
  deposit: types.u128
  raw_solution: types.pallet_election_provider_multi_phase.RawSolution
  call_fee: types.u128
}

export function SignedSubmission(
  value: types.pallet_election_provider_multi_phase.signed.SignedSubmission,
) {
  return value
}
