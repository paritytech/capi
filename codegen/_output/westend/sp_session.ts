import { $, BitSequence, ChainError, Era } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $membershipProof: $.Codec<t.sp_session.MembershipProof> = _codec.$191

export interface MembershipProof {
  session: t.u32
  trie_nodes: Array<Uint8Array>
  validator_count: t.u32
}

export function MembershipProof(value: t.sp_session.MembershipProof) {
  return value
}
