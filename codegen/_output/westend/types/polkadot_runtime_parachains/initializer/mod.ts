import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export interface BufferedSessionChange {
  validators: Array<types.polkadot_primitives.v2.validator_app.Public>
  queued: Array<types.polkadot_primitives.v2.validator_app.Public>
  sessionIndex: types.u32
}

export function BufferedSessionChange(
  value: types.polkadot_runtime_parachains.initializer.BufferedSessionChange,
) {
  return value
}
