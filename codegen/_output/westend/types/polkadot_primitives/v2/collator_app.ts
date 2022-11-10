import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $public: $.Codec<t.types.polkadot_primitives.v2.collator_app.Public> = _codec.$99

export const $signature: $.Codec<t.types.polkadot_primitives.v2.collator_app.Signature> =
  _codec.$100

export type Public = t.types.sp_core.sr25519.Public

export function Public(value: t.types.polkadot_primitives.v2.collator_app.Public) {
  return value
}

export type Signature = t.types.sp_core.sr25519.Signature

export function Signature(value: t.types.polkadot_primitives.v2.collator_app.Signature) {
  return value
}
