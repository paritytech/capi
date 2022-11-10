import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as pallet from "./pallet.ts"

export const $bufferedSessionChange: $.Codec<
  t.types.polkadot_runtime_parachains.initializer.BufferedSessionChange
> = _codec.$681

export interface BufferedSessionChange {
  validators: Array<t.types.polkadot_primitives.v2.validator_app.Public>
  queued: Array<t.types.polkadot_primitives.v2.validator_app.Public>
  session_index: t.types.u32
}

export function BufferedSessionChange(
  value: t.types.polkadot_runtime_parachains.initializer.BufferedSessionChange,
) {
  return value
}
