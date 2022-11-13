import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.initializer.pallet.Call> = _codec.$406

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = types.polkadot_runtime_parachains.initializer.pallet.Call.force_approve
export namespace Call {
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export interface force_approve {
    type: "force_approve"
    up_to: types.u32
  }
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export function force_approve(
    value: Omit<types.polkadot_runtime_parachains.initializer.pallet.Call.force_approve, "type">,
  ): types.polkadot_runtime_parachains.initializer.pallet.Call.force_approve {
    return { type: "force_approve", ...value }
  }
}
