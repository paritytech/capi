import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export interface UncheckedSigned {
  payload: types.polkadot_primitives.v2.AvailabilityBitfield
  validator_index: types.polkadot_primitives.v2.ValidatorIndex
  signature: types.polkadot_primitives.v2.validator_app.Signature
}

export function UncheckedSigned(value: types.polkadot_primitives.v2.signed.UncheckedSigned) {
  return value
}
