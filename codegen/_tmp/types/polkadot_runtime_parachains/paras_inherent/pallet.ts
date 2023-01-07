import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_parachains.paras_inherent.pallet.Call> =
  codecs.$377
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter
export namespace Call {
  /** Enter the paras inherent. This will process bitfields and backed candidates. */
  export interface enter {
    type: "enter"
    data: types.polkadot_primitives.v2.InherentData
  }
  /** Enter the paras inherent. This will process bitfields and backed candidates. */
  export function enter(
    value: Omit<types.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter, "type">,
  ): types.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter {
    return { type: "enter", ...value }
  }
}

export const $error: $.Codec<types.polkadot_runtime_parachains.paras_inherent.pallet.Error> =
  codecs.$644
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "TooManyInclusionInherents"
  | "InvalidParentHeader"
  | "CandidateConcludedInvalid"
  | "InherentOverweight"
  | "DisputeStatementsUnsortedOrDuplicates"
  | "DisputeInvalid"
