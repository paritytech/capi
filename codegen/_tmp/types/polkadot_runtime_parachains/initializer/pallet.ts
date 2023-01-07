import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.initializer.pallet.Call> = codecs.$405
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.polkadot_runtime_parachains.initializer.pallet.Call.forceApprove
export namespace Call {
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export interface forceApprove {
    type: "forceApprove"
    upTo: types.u32
  }
  /**
   * Issue a signal to the consensus engine to forcibly act as though all parachain
   * blocks in all relay chain blocks up to and including the given number in the current
   * chain are valid and should be finalized.
   */
  export function forceApprove(
    value: Omit<types.polkadot_runtime_parachains.initializer.pallet.Call.forceApprove, "type">,
  ): types.polkadot_runtime_parachains.initializer.pallet.Call.forceApprove {
    return { type: "forceApprove", ...value }
  }
}
