import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export const $membershipProof: $.Codec<types.sp_session.MembershipProof> = codecs.$191
export interface MembershipProof {
  session: types.u32
  trieNodes: Array<Uint8Array>
  validatorCount: types.u32
}

export function MembershipProof(value: types.sp_session.MembershipProof) {
  return value
}
