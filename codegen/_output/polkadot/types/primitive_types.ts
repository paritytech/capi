import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const $h256: $.Codec<types.primitive_types.H256> = _codec.$11

export type H256 = Uint8Array

export function H256(value: types.primitive_types.H256) {
  return value
}
