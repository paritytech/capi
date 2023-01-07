import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $public: $.Codec<types.sp_core.sr25519.Public> = codecs.$54
export type Public = Uint8Array

export function Public(value: types.sp_core.sr25519.Public) {
  return value
}

export const $signature: $.Codec<types.sp_core.sr25519.Signature> = codecs.$100
export type Signature = Uint8Array

export function Signature(value: types.sp_core.sr25519.Signature) {
  return value
}
