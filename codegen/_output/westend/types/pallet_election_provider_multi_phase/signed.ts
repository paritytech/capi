import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $signedSubmission: $.Codec<
  t.types.pallet_election_provider_multi_phase.signed.SignedSubmission
> = _codec.$610

export interface SignedSubmission {
  who: t.types.sp_core.crypto.AccountId32
  deposit: t.types.u128
  raw_solution: t.types.pallet_election_provider_multi_phase.RawSolution
  call_fee: t.types.u128
}

export function SignedSubmission(
  value: t.types.pallet_election_provider_multi_phase.signed.SignedSubmission,
) {
  return value
}
