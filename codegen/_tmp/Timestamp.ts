import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Current time for the current block. */
export const Now = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Timestamp",
  "Now",
  $.tuple(),
  codecs.$9,
)

/** Did the timestamp get updated in this block? */
export const DidUpdate = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Timestamp",
  "DidUpdate",
  $.tuple(),
  codecs.$43,
)

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
export function set(value: Omit<types.pallet_timestamp.pallet.Call.set, "type">) {
  return { type: "Timestamp", value: { ...value, type: "set" } }
}

/**
 *  The minimum period between blocks. Beware that this is different to the *expected*
 *  period that the block production apparatus provides. Your chosen consensus system will
 *  generally work with this to determine a sensible block time. e.g. For Aura, it will be
 *  double this period on default settings.
 */
export const MinimumPeriod: types.u64 = codecs.$9.decode(C.hex.decode("b80b000000000000" as C.Hex))
