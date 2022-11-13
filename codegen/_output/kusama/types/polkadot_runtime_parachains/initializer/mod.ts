import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $bufferedSessionChange: $.Codec<
  types.polkadot_runtime_parachains.initializer.BufferedSessionChange
> = _codec.$681

export interface BufferedSessionChange {
  validators: Array<types.polkadot_primitives.v2.validator_app.Public>
  queued: Array<types.polkadot_primitives.v2.validator_app.Public>
  session_index: types.u32
}

export function BufferedSessionChange(
  value: types.polkadot_runtime_parachains.initializer.BufferedSessionChange,
) {
  return value
}
