import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const $membershipProof: $.Codec<types.sp_session.MembershipProof> = _codec.$191

export interface MembershipProof {
  session: types.u32
  trie_nodes: Array<Uint8Array>
  validator_count: types.u32
}

export function MembershipProof(value: types.sp_session.MembershipProof) {
  return value
}
