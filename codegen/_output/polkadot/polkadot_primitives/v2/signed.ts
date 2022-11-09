import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $uncheckedSigned: $.Codec<t.polkadot_primitives.v2.signed.UncheckedSigned> =
  _codec.$381

export interface UncheckedSigned {
  payload: t.polkadot_primitives.v2.AvailabilityBitfield
  validator_index: t.polkadot_primitives.v2.ValidatorIndex
  signature: t.polkadot_primitives.v2.validator_app.Signature
}

export function UncheckedSigned(value: t.polkadot_primitives.v2.signed.UncheckedSigned) {
  return value
}
