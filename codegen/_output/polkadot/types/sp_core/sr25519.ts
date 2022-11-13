import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $public: $.Codec<types.sp_core.sr25519.Public> = _codec.$54

export const $signature: $.Codec<types.sp_core.sr25519.Signature> = _codec.$101

export type Public = Uint8Array

export function Public(value: types.sp_core.sr25519.Public) {
  return value
}

export type Signature = Uint8Array

export function Signature(value: types.sp_core.sr25519.Signature) {
  return value
}
