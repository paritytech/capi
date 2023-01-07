import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $signedSubmission: $.Codec<
  types.pallet_election_provider_multi_phase.signed.SignedSubmission
> = codecs.$606
export interface SignedSubmission {
  who: types.sp_core.crypto.AccountId32
  deposit: types.u128
  rawSolution: types.pallet_election_provider_multi_phase.RawSolution
  callFee: types.u128
}

export function SignedSubmission(
  value: types.pallet_election_provider_multi_phase.signed.SignedSubmission,
) {
  return value
}
