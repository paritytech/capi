import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $public: $.Codec<types.sp_core.ed25519.Public> = codecs.$51
export type Public = Uint8Array

export function Public(value: types.sp_core.ed25519.Public) {
  return value
}

export const $signature: $.Codec<types.sp_core.ed25519.Signature> = codecs.$222
export type Signature = Uint8Array

export function Signature(value: types.sp_core.ed25519.Signature) {
  return value
}
