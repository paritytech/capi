import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $public: $.Codec<types.polkadot_primitives.v2.collator_app.Public> = _codec.$99

export const $signature: $.Codec<types.polkadot_primitives.v2.collator_app.Signature> = _codec.$100

export type Public = types.sp_core.sr25519.Public

export function Public(value: types.polkadot_primitives.v2.collator_app.Public) {
  return value
}

export type Signature = types.sp_core.sr25519.Signature

export function Signature(value: types.polkadot_primitives.v2.collator_app.Signature) {
  return value
}
