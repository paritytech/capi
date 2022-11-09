import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $public: $.Codec<t.sp_finality_grandpa.app.Public> = _codec.$50

export const $signature: $.Codec<t.sp_finality_grandpa.app.Signature> = _codec.$221

export type Public = t.sp_core.ed25519.Public

export function Public(value: t.sp_finality_grandpa.app.Public) {
  return value
}

export type Signature = t.sp_core.ed25519.Signature

export function Signature(value: t.sp_finality_grandpa.app.Signature) {
  return value
}
