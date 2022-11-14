import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
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
export function batch(
  value: Omit<types.pallet_utility.pallet.Call.batch, "type">,
): types.polkadot_runtime.RuntimeCall {
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
export function as_derivative(
  value: Omit<types.pallet_utility.pallet.Call.as_derivative, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Utility", value: { ...value, type: "as_derivative" } }
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
export function batch_all(
  value: Omit<types.pallet_utility.pallet.Call.batch_all, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Utility", value: { ...value, type: "batch_all" } }
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
export function dispatch_as(
  value: Omit<types.pallet_utility.pallet.Call.dispatch_as, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Utility", value: { ...value, type: "dispatch_as" } }
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
export function force_batch(
  value: Omit<types.pallet_utility.pallet.Call.force_batch, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Utility", value: { ...value, type: "force_batch" } }
}
