import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export const $h256: $.Codec<types.primitive_types.H256> = codecs.$10
export type H256 = Uint8Array

export function H256(value: types.primitive_types.H256) {
  return value
}
