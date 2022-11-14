import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export type Public = Uint8Array

export function Public(value: types.sp_core.ecdsa.Public) {
  return value
}

export type Signature = Uint8Array

export function Signature(value: types.sp_core.ecdsa.Signature) {
  return value
}
