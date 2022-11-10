import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  Simple preimage lookup from the reason's hash to the original data. Again, has an
 *  insecure enumerable hash since the key is guaranteed to be the result of a secure hash.
 */
export const Reasons = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$12,
}

/**
 *  TipsMap that are not yet completed. Keyed by the hash of `(reason, who)` from the value.
 *  This has the insecure enumerable hash function since the key itself is already
 *  guaranteed to be a secure hash.
 */
export const Tips = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$11),
  value: _codec.$598,
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
export function close_tip(
  value: Omit<t.types.pallet_tips.pallet.Call.close_tip, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "close_tip" } }
}

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
export function report_awesome(
  value: Omit<t.types.pallet_tips.pallet.Call.report_awesome, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "report_awesome" } }
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
export function retract_tip(
  value: Omit<t.types.pallet_tips.pallet.Call.retract_tip, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "retract_tip" } }
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
export function slash_tip(
  value: Omit<t.types.pallet_tips.pallet.Call.slash_tip, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "slash_tip" } }
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
  value: Omit<t.types.pallet_tips.pallet.Call.tip, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "tip" } }
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
export function tip_new(
  value: Omit<t.types.pallet_tips.pallet.Call.tip_new, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Tips", value: { ...value, type: "tip_new" } }
}
