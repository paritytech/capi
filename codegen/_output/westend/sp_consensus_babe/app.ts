import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $public: $.Codec<t.sp_consensus_babe.app.Public> = _codec.$189

export type Public = t.sp_core.sr25519.Public

export function Public(value: t.sp_consensus_babe.app.Public) {
  return value
}
