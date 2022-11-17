import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_tips.pallet.Call.reportAwesome
  | types.pallet_tips.pallet.Call.retractTip
  | types.pallet_tips.pallet.Call.tipNew
  | types.pallet_tips.pallet.Call.tip
  | types.pallet_tips.pallet.Call.closeTip
  | types.pallet_tips.pallet.Call.slashTip
export namespace Call {
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
  export interface reportAwesome {
    type: "reportAwesome"
    reason: Uint8Array
    who: types.sp_runtime.multiaddress.MultiAddress
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
  export interface retractTip {
    type: "retractTip"
    hash: types.primitive_types.H256
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
  export interface tipNew {
    type: "tipNew"
    reason: Uint8Array
    who: types.sp_runtime.multiaddress.MultiAddress
    tipValue: types.Compact<types.u128>
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
  export interface tip {
    type: "tip"
    hash: types.primitive_types.H256
    tipValue: types.Compact<types.u128>
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
  export interface closeTip {
    type: "closeTip"
    hash: types.primitive_types.H256
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
  export interface slashTip {
    type: "slashTip"
    hash: types.primitive_types.H256
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
  export function reportAwesome(
    value: Omit<types.pallet_tips.pallet.Call.reportAwesome, "type">,
  ): types.pallet_tips.pallet.Call.reportAwesome {
    return { type: "reportAwesome", ...value }
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
  ): types.pallet_tips.pallet.Call.retractTip {
    return { type: "retractTip", ...value }
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
  ): types.pallet_tips.pallet.Call.tipNew {
    return { type: "tipNew", ...value }
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
  ): types.pallet_tips.pallet.Call.tip {
    return { type: "tip", ...value }
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
  ): types.pallet_tips.pallet.Call.closeTip {
    return { type: "closeTip", ...value }
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
  ): types.pallet_tips.pallet.Call.slashTip {
    return { type: "slashTip", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "ReasonTooBig"
  | "AlreadyKnown"
  | "UnknownTip"
  | "NotFinder"
  | "StillOpen"
  | "Premature"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_tips.pallet.Event.NewTip
  | types.pallet_tips.pallet.Event.TipClosing
  | types.pallet_tips.pallet.Event.TipClosed
  | types.pallet_tips.pallet.Event.TipRetracted
  | types.pallet_tips.pallet.Event.TipSlashed
export namespace Event {
  /** A new tip suggestion has been opened. */
  export interface NewTip {
    type: "NewTip"
    tipHash: types.primitive_types.H256
  }
  /** A tip suggestion has reached threshold and is closing. */
  export interface TipClosing {
    type: "TipClosing"
    tipHash: types.primitive_types.H256
  }
  /** A tip suggestion has been closed. */
  export interface TipClosed {
    type: "TipClosed"
    tipHash: types.primitive_types.H256
    who: types.sp_core.crypto.AccountId32
    payout: types.u128
  }
  /** A tip suggestion has been retracted. */
  export interface TipRetracted {
    type: "TipRetracted"
    tipHash: types.primitive_types.H256
  }
  /** A tip suggestion has been slashed. */
  export interface TipSlashed {
    type: "TipSlashed"
    tipHash: types.primitive_types.H256
    finder: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A new tip suggestion has been opened. */
  export function NewTip(
    value: Omit<types.pallet_tips.pallet.Event.NewTip, "type">,
  ): types.pallet_tips.pallet.Event.NewTip {
    return { type: "NewTip", ...value }
  }
  /** A tip suggestion has reached threshold and is closing. */
  export function TipClosing(
    value: Omit<types.pallet_tips.pallet.Event.TipClosing, "type">,
  ): types.pallet_tips.pallet.Event.TipClosing {
    return { type: "TipClosing", ...value }
  }
  /** A tip suggestion has been closed. */
  export function TipClosed(
    value: Omit<types.pallet_tips.pallet.Event.TipClosed, "type">,
  ): types.pallet_tips.pallet.Event.TipClosed {
    return { type: "TipClosed", ...value }
  }
  /** A tip suggestion has been retracted. */
  export function TipRetracted(
    value: Omit<types.pallet_tips.pallet.Event.TipRetracted, "type">,
  ): types.pallet_tips.pallet.Event.TipRetracted {
    return { type: "TipRetracted", ...value }
  }
  /** A tip suggestion has been slashed. */
  export function TipSlashed(
    value: Omit<types.pallet_tips.pallet.Event.TipSlashed, "type">,
  ): types.pallet_tips.pallet.Event.TipSlashed {
    return { type: "TipSlashed", ...value }
  }
}
