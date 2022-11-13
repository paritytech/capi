import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $public: $.Codec<types.sp_finality_grandpa.app.Public> = _codec.$50

export const $signature: $.Codec<types.sp_finality_grandpa.app.Signature> = _codec.$221

export type Public = types.sp_core.ed25519.Public

export function Public(value: types.sp_finality_grandpa.app.Public) {
  return value
}

export type Signature = types.sp_core.ed25519.Signature

export function Signature(value: types.sp_finality_grandpa.app.Signature) {
  return value
}
