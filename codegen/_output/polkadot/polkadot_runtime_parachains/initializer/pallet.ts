import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.polkadot_runtime_parachains.initializer.pallet.Call> = _codec.$406

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = t.polkadot_runtime_parachains.initializer.pallet.Call.force_approve
export namespace Call {
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export interface force_approve {
    type: "force_approve"
    up_to: t.u32
  }
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export function force_approve(
    value: Omit<t.polkadot_runtime_parachains.initializer.pallet.Call.force_approve, "type">,
  ): t.polkadot_runtime_parachains.initializer.pallet.Call.force_approve {
    return { type: "force_approve", ...value }
  }
}
