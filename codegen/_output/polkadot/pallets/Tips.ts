import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  TipsMap that are not yet completed. Keyed by the hash of `(reason, who)` from the value.
 *  This has the insecure enumerable hash function since the key itself is already
 *  guaranteed to be a secure hash.
 */
export const Tips = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Tips",
  "Tips",
  $.tuple(codecs.$11),
  codecs.$598,
)

/**
 *  Simple preimage lookup from the reason's hash to the original data. Again, has an
 *  insecure enumerable hash since the key is guaranteed to be the result of a secure hash.
 */
export const Reasons = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Tips",
  "Reasons",
  $.tuple(codecs.$11),
  codecs.$12,
)

/**
 * Report something `reason` that deserves a tip and claim any eventual the finder's fee.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
 * `DataDepositPerByte` for each byte in `reason`.
 *
 * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
 *   a UTF-8-encoded URL.
 * - `who`: The account which should be credited for the tip.
 *
 * Emits `NewTip` if successful.
 *
 * # <weight>
 * - Complexity: `O(R)` where `R` length of `reason`.
 *   - encoding and hashing of 'reason'
 * - DbReads: `Reasons`, `Tips`
 * - DbWrites: `Reasons`, `Tips`
 * # </weight>
 */
export function reportAwesome(
  value: Omit<types.pallet_tips.pallet.Call.reportAwesome, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "reportAwesome" } }
}

/**
 * Retract a prior tip-report from `report_awesome`, and cancel the process of tipping.
 *
 * If successful, the original deposit will be unreserved.
 *
 * The dispatch origin for this call must be _Signed_ and the tip identified by `hash`
 * must have been reported by the signing account through `report_awesome` (and not
 * through `tip_new`).
 *
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
 *
 * Emits `TipRetracted` if successful.
 *
 * # <weight>
 * - Complexity: `O(1)`
 *   - Depends on the length of `T::Hash` which is fixed.
 * - DbReads: `Tips`, `origin account`
 * - DbWrites: `Reasons`, `Tips`, `origin account`
 * # </weight>
 */
export function retractTip(
  value: Omit<types.pallet_tips.pallet.Call.retractTip, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "retractTip" } }
}

/**
 * Give a tip for something new; no finder's fee will be taken.
 *
 * The dispatch origin for this call must be _Signed_ and the signing account must be a
 * member of the `Tippers` set.
 *
 * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
 *   a UTF-8-encoded URL.
 * - `who`: The account which should be credited for the tip.
 * - `tip_value`: The amount of tip that the sender would like to give. The median tip
 *   value of active tippers will be given to the `who`.
 *
 * Emits `NewTip` if successful.
 *
 * # <weight>
 * - Complexity: `O(R + T)` where `R` length of `reason`, `T` is the number of tippers.
 *   - `O(T)`: decoding `Tipper` vec of length `T`. `T` is charged as upper bound given by
 *     `ContainsLengthBound`. The actual cost depends on the implementation of
 *     `T::Tippers`.
 *   - `O(R)`: hashing and encoding of reason of length `R`
 * - DbReads: `Tippers`, `Reasons`
 * - DbWrites: `Reasons`, `Tips`
 * # </weight>
 */
export function tipNew(
  value: Omit<types.pallet_tips.pallet.Call.tipNew, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "tipNew" } }
}

/**
 * Declare a tip value for an already-open tip.
 *
 * The dispatch origin for this call must be _Signed_ and the signing account must be a
 * member of the `Tippers` set.
 *
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the hash of the original tip `reason` and the beneficiary
 *   account ID.
 * - `tip_value`: The amount of tip that the sender would like to give. The median tip
 *   value of active tippers will be given to the `who`.
 *
 * Emits `TipClosing` if the threshold of tippers has been reached and the countdown period
 * has started.
 *
 * # <weight>
 * - Complexity: `O(T)` where `T` is the number of tippers. decoding `Tipper` vec of length
 *   `T`, insert tip and check closing, `T` is charged as upper bound given by
 *   `ContainsLengthBound`. The actual cost depends on the implementation of `T::Tippers`.
 *
 *   Actually weight could be lower as it depends on how many tips are in `OpenTip` but it
 *   is weighted as if almost full i.e of length `T-1`.
 * - DbReads: `Tippers`, `Tips`
 * - DbWrites: `Tips`
 * # </weight>
 */
export function tip(
  value: Omit<types.pallet_tips.pallet.Call.tip, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "tip" } }
}

/**
 * Close and payout a tip.
 *
 * The dispatch origin for this call must be _Signed_.
 *
 * The tip identified by `hash` must have finished its countdown period.
 *
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
 *
 * # <weight>
 * - Complexity: `O(T)` where `T` is the number of tippers. decoding `Tipper` vec of length
 *   `T`. `T` is charged as upper bound given by `ContainsLengthBound`. The actual cost
 *   depends on the implementation of `T::Tippers`.
 * - DbReads: `Tips`, `Tippers`, `tip finder`
 * - DbWrites: `Reasons`, `Tips`, `Tippers`, `tip finder`
 * # </weight>
 */
export function closeTip(
  value: Omit<types.pallet_tips.pallet.Call.closeTip, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "closeTip" } }
}

/**
 * Remove and slash an already-open tip.
 *
 * May only be called from `T::RejectOrigin`.
 *
 * As a result, the finder is slashed and the deposits are lost.
 *
 * Emits `TipSlashed` if successful.
 *
 * # <weight>
 *   `T` is charged as upper bound given by `ContainsLengthBound`.
 *   The actual cost depends on the implementation of `T::Tippers`.
 * # </weight>
 */
export function slashTip(
  value: Omit<types.pallet_tips.pallet.Call.slashTip, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "slashTip" } }
}
