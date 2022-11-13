import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $uncheckedSigned: $.Codec<types.polkadot_primitives.v2.signed.UncheckedSigned> =
  _codec.$381

export interface UncheckedSigned {
  payload: types.polkadot_primitives.v2.AvailabilityBitfield
  validator_index: types.polkadot_primitives.v2.ValidatorIndex
  signature: types.polkadot_primitives.v2.validator_app.Signature
}

export function UncheckedSigned(value: types.polkadot_primitives.v2.signed.UncheckedSigned) {
  return value
}
