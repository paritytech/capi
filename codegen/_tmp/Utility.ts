import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 * Send a batch of dispatch calls.
 *
 * May be called from any origin.
 *
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 *
 * If origin is root then call are dispatch without checking origin filter. (This includes
 * bypassing `frame_system::Config::BaseCallFilter`).
 *
 * # <weight>
 * - Complexity: O(C) where C is the number of calls to be batched.
 * # </weight>
 *
 * This will return `Ok` in all circumstances. To determine the success of the batch, an
 * event is deposited. If a call failed and the batch was interrupted, then the
 * `BatchInterrupted` event is deposited, along with the number of successful calls made
 * and the error of the failed call. If all were successful, then the `BatchCompleted`
 * event is deposited.
 */
export function batch(value: Omit<types.pallet_utility.pallet.Call.batch, "type">) {
  return { type: "Utility", value: { ...value, type: "batch" } }
}

/**
 * Send a call through an indexed pseudonym of the sender.
 *
 * Filter from origin are passed along. The call will be dispatched with an origin which
 * use the same filter as the origin of this call.
 *
 * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
 * because you expect `proxy` to have been used prior in the call stack and you do not want
 * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
 * in the Multisig pallet instead.
 *
 * NOTE: Prior to version *12, this was called `as_limited_sub`.
 *
 * The dispatch origin for this call must be _Signed_.
 */
export function asDerivative(value: Omit<types.pallet_utility.pallet.Call.asDerivative, "type">) {
  return { type: "Utility", value: { ...value, type: "asDerivative" } }
}

/**
 * Send a batch of dispatch calls and atomically execute them.
 * The whole transaction will rollback and fail if any of the calls failed.
 *
 * May be called from any origin.
 *
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 *
 * If origin is root then call are dispatch without checking origin filter. (This includes
 * bypassing `frame_system::Config::BaseCallFilter`).
 *
 * # <weight>
 * - Complexity: O(C) where C is the number of calls to be batched.
 * # </weight>
 */
export function batchAll(value: Omit<types.pallet_utility.pallet.Call.batchAll, "type">) {
  return { type: "Utility", value: { ...value, type: "batchAll" } }
}

/**
 * Dispatches a function call with a provided origin.
 *
 * The dispatch origin for this call must be _Root_.
 *
 * # <weight>
 * - O(1).
 * - Limited storage reads.
 * - One DB write (event).
 * - Weight of derivative `call` execution + T::WeightInfo::dispatch_as().
 * # </weight>
 */
export function dispatchAs(value: Omit<types.pallet_utility.pallet.Call.dispatchAs, "type">) {
  return { type: "Utility", value: { ...value, type: "dispatchAs" } }
}

/**
 * Send a batch of dispatch calls.
 * Unlike `batch`, it allows errors and won't interrupt.
 *
 * May be called from any origin.
 *
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 *
 * If origin is root then call are dispatch without checking origin filter. (This includes
 * bypassing `frame_system::Config::BaseCallFilter`).
 *
 * # <weight>
 * - Complexity: O(C) where C is the number of calls to be batched.
 * # </weight>
 */
export function forceBatch(value: Omit<types.pallet_utility.pallet.Call.forceBatch, "type">) {
  return { type: "Utility", value: { ...value, type: "forceBatch" } }
}

/** The limit on the number of batched calls. */
export const batched_calls_limit: types.u32 = codecs.$4.decode(C.hex.decode("aa2a0000" as C.Hex))
