import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $public: $.Codec<types.polkadot_primitives.v2.collator_app.Public> = codecs.$98
export type Public = types.sp_core.sr25519.Public

export function Public(value: types.polkadot_primitives.v2.collator_app.Public) {
  return value
}

export const $signature: $.Codec<types.polkadot_primitives.v2.collator_app.Signature> = codecs.$99
export type Signature = types.sp_core.sr25519.Signature

export function Signature(value: types.polkadot_primitives.v2.collator_app.Signature) {
  return value
}
