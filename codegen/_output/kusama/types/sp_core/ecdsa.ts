import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $public: $.Codec<types.sp_core.ecdsa.Public> = _codec.$418

export const $signature: $.Codec<types.sp_core.ecdsa.Signature> = _codec.$422

export type Public = Uint8Array

export function Public(value: types.sp_core.ecdsa.Public) {
  return value
}

export type Signature = Uint8Array

export function Signature(value: types.sp_core.ecdsa.Signature) {
  return value
}
