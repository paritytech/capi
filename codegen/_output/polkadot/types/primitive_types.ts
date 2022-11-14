import { $, C } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "./mod.ts"

export type H256 = Uint8Array

export function H256(value: types.primitive_types.H256) {
  return value
}
