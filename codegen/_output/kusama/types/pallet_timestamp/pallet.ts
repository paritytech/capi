import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call = types.pallet_timestamp.pallet.Call.set
export namespace Call {
  /**
   * Set the current time.
   *
   * This call should be invoked exactly once per block. It will panic at the finalization
   * phase, if this call hasn't been invoked by that time.
   *
   * The timestamp should be greater than the previous one by the amount specified by
   * `MinimumPeriod`.
   *
   * The dispatch origin for this call must be `Inherent`.
   *
   * # <weight>
   * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
   * - 1 storage read and 1 storage mutation (codec `O(1)`). (because of `DidUpdate::take` in
   *   `on_finalize`)
   * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
   * # </weight>
   */
  export interface set {
    type: "set"
    now: types.Compact<types.u64>
  }
  /**
   * Set the current time.
   *
   * This call should be invoked exactly once per block. It will panic at the finalization
   * phase, if this call hasn't been invoked by that time.
   *
   * The timestamp should be greater than the previous one by the amount specified by
   * `MinimumPeriod`.
   *
   * The dispatch origin for this call must be `Inherent`.
   *
   * # <weight>
   * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
   * - 1 storage read and 1 storage mutation (codec `O(1)`). (because of `DidUpdate::take` in
   *   `on_finalize`)
   * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
   * # </weight>
   */
  export function set(
    value: Omit<types.pallet_timestamp.pallet.Call.set, "type">,
  ): types.pallet_timestamp.pallet.Call.set {
    return { type: "set", ...value }
  }
}
