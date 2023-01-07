import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $public: $.Codec<types.sp_finality_grandpa.app.Public> = codecs.$50
export type Public = types.sp_core.ed25519.Public

export function Public(value: types.sp_finality_grandpa.app.Public) {
  return value
}

export const $signature: $.Codec<types.sp_finality_grandpa.app.Signature> = codecs.$221
export type Signature = types.sp_core.ed25519.Signature

export function Signature(value: types.sp_finality_grandpa.app.Signature) {
  return value
}
