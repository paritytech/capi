import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.polkadot_runtime_parachains.paras_inherent.pallet.Call> = _codec.$378

export const $error: $.Codec<t.polkadot_runtime_parachains.paras_inherent.pallet.Error> =
  _codec.$652

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = t.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter
export namespace Call {
  /** Enter the paras inherent. This will process bitfields and backed candidates. */
  export interface enter {
    type: "enter"
    data: t.polkadot_primitives.v2.InherentData
  }
  /** Enter the paras inherent. This will process bitfields and backed candidates. */
  export function enter(
    value: Omit<t.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter, "type">,
  ): t.polkadot_runtime_parachains.paras_inherent.pallet.Call.enter {
    return { type: "enter", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "TooManyInclusionInherents"
  | "InvalidParentHeader"
  | "CandidateConcludedInvalid"
  | "InherentOverweight"
  | "DisputeStatementsUnsortedOrDuplicates"
  | "DisputeInvalid"
