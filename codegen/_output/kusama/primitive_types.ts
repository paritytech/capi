import { $, BitSequence, ChainError, Era } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $h256: $.Codec<t.primitive_types.H256> = _codec.$11

export type H256 = Uint8Array

export function H256(value: t.primitive_types.H256) {
  return value
}
