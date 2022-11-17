import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_utility.pallet.Call.batch
  | types.pallet_utility.pallet.Call.asDerivative
  | types.pallet_utility.pallet.Call.batchAll
  | types.pallet_utility.pallet.Call.dispatchAs
  | types.pallet_utility.pallet.Call.forceBatch
export namespace Call {
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
  export interface batch {
    type: "batch"
    calls: Array<types.polkadot_runtime.RuntimeCall>
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
  export interface asDerivative {
    type: "asDerivative"
    index: types.u16
    call: types.polkadot_runtime.RuntimeCall
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
  export interface batchAll {
    type: "batchAll"
    calls: Array<types.polkadot_runtime.RuntimeCall>
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
  export interface dispatchAs {
    type: "dispatchAs"
    asOrigin: types.polkadot_runtime.OriginCaller
    call: types.polkadot_runtime.RuntimeCall
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
  export interface forceBatch {
    type: "forceBatch"
    calls: Array<types.polkadot_runtime.RuntimeCall>
  }
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
  ): types.pallet_utility.pallet.Call.batch {
    return { type: "batch", ...value }
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
  export function asDerivative(
    value: Omit<types.pallet_utility.pallet.Call.asDerivative, "type">,
  ): types.pallet_utility.pallet.Call.asDerivative {
    return { type: "asDerivative", ...value }
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
  export function batchAll(
    value: Omit<types.pallet_utility.pallet.Call.batchAll, "type">,
  ): types.pallet_utility.pallet.Call.batchAll {
    return { type: "batchAll", ...value }
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
  export function dispatchAs(
    value: Omit<types.pallet_utility.pallet.Call.dispatchAs, "type">,
  ): types.pallet_utility.pallet.Call.dispatchAs {
    return { type: "dispatchAs", ...value }
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
  export function forceBatch(
    value: Omit<types.pallet_utility.pallet.Call.forceBatch, "type">,
  ): types.pallet_utility.pallet.Call.forceBatch {
    return { type: "forceBatch", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error = "TooManyCalls"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_utility.pallet.Event.BatchInterrupted
  | types.pallet_utility.pallet.Event.BatchCompleted
  | types.pallet_utility.pallet.Event.BatchCompletedWithErrors
  | types.pallet_utility.pallet.Event.ItemCompleted
  | types.pallet_utility.pallet.Event.ItemFailed
  | types.pallet_utility.pallet.Event.DispatchedAs
export namespace Event {
  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  export interface BatchInterrupted {
    type: "BatchInterrupted"
    index: types.u32
    error: types.sp_runtime.DispatchError
  }
  /** Batch of dispatches completed fully with no error. */
  export interface BatchCompleted {
    type: "BatchCompleted"
  }
  /** Batch of dispatches completed but has errors. */
  export interface BatchCompletedWithErrors {
    type: "BatchCompletedWithErrors"
  }
  /** A single item within a Batch of dispatches has completed with no error. */
  export interface ItemCompleted {
    type: "ItemCompleted"
  }
  /** A single item within a Batch of dispatches has completed with error. */
  export interface ItemFailed {
    type: "ItemFailed"
    error: types.sp_runtime.DispatchError
  }
  /** A call was dispatched. */
  export interface DispatchedAs {
    type: "DispatchedAs"
    result: null | C.ChainError<types.sp_runtime.DispatchError>
  }
  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  export function BatchInterrupted(
    value: Omit<types.pallet_utility.pallet.Event.BatchInterrupted, "type">,
  ): types.pallet_utility.pallet.Event.BatchInterrupted {
    return { type: "BatchInterrupted", ...value }
  }
  /** Batch of dispatches completed fully with no error. */
  export function BatchCompleted(): types.pallet_utility.pallet.Event.BatchCompleted {
    return { type: "BatchCompleted" }
  }
  /** Batch of dispatches completed but has errors. */
  export function BatchCompletedWithErrors(): types.pallet_utility.pallet.Event.BatchCompletedWithErrors {
    return { type: "BatchCompletedWithErrors" }
  }
  /** A single item within a Batch of dispatches has completed with no error. */
  export function ItemCompleted(): types.pallet_utility.pallet.Event.ItemCompleted {
    return { type: "ItemCompleted" }
  }
  /** A single item within a Batch of dispatches has completed with error. */
  export function ItemFailed(
    value: Omit<types.pallet_utility.pallet.Event.ItemFailed, "type">,
  ): types.pallet_utility.pallet.Event.ItemFailed {
    return { type: "ItemFailed", ...value }
  }
  /** A call was dispatched. */
  export function DispatchedAs(
    value: Omit<types.pallet_utility.pallet.Event.DispatchedAs, "type">,
  ): types.pallet_utility.pallet.Event.DispatchedAs {
    return { type: "DispatchedAs", ...value }
  }
}
