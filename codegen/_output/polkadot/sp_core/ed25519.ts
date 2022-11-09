import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $public: $.Codec<t.sp_core.ed25519.Public> = _codec.$51

export const $signature: $.Codec<t.sp_core.ed25519.Signature> = _codec.$222

export type Public = Uint8Array

export function Public(value: t.sp_core.ed25519.Public) {
  return value
}

export type Signature = Uint8Array

export function Signature(value: t.sp_core.ed25519.Signature) {
  return value
}
