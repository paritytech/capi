import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $public: $.Codec<t.sp_core.ecdsa.Public> = _codec.$418

export const $signature: $.Codec<t.sp_core.ecdsa.Signature> = _codec.$422

export type Public = Uint8Array

export function Public(value: t.sp_core.ecdsa.Public) {
  return value
}

export type Signature = Uint8Array

export function Signature(value: t.sp_core.ecdsa.Signature) {
  return value
}
