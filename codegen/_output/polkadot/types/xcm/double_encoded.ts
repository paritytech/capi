import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export interface DoubleEncoded {
  encoded: Uint8Array
}

export function DoubleEncoded(value: types.xcm.double_encoded.DoubleEncoded) {
  return value
}
