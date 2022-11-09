import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $public: $.Codec<t.polkadot_primitives.v2.validator_app.Public> = _codec.$213

export const $signature: $.Codec<t.polkadot_primitives.v2.validator_app.Signature> = _codec.$386

export type Public = t.sp_core.sr25519.Public

export function Public(value: t.polkadot_primitives.v2.validator_app.Public) {
  return value
}

export type Signature = t.sp_core.sr25519.Signature

export function Signature(value: t.polkadot_primitives.v2.validator_app.Signature) {
  return value
}
