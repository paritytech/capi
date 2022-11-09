import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_utility.pallet.Call> = _codec.$254

export const $error: $.Codec<t.pallet_utility.pallet.Error> = _codec.$567

export const $event: $.Codec<t.pallet_utility.pallet.Event> = _codec.$76

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_utility.pallet.Call.batch
  | t.pallet_utility.pallet.Call.as_derivative
  | t.pallet_utility.pallet.Call.batch_all
  | t.pallet_utility.pallet.Call.dispatch_as
  | t.pallet_utility.pallet.Call.force_batch
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
    calls: Array<t.polkadot_runtime.RuntimeCall>
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
  export interface as_derivative {
    type: "as_derivative"
    index: t.u16
    call: t.polkadot_runtime.RuntimeCall
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
  export interface batch_all {
    type: "batch_all"
    calls: Array<t.polkadot_runtime.RuntimeCall>
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
  export interface dispatch_as {
    type: "dispatch_as"
    as_origin: t.polkadot_runtime.OriginCaller
    call: t.polkadot_runtime.RuntimeCall
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
  export interface force_batch {
    type: "force_batch"
    calls: Array<t.polkadot_runtime.RuntimeCall>
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
    value: Omit<t.pallet_utility.pallet.Call.batch, "type">,
  ): t.pallet_utility.pallet.Call.batch {
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
  export function as_derivative(
    value: Omit<t.pallet_utility.pallet.Call.as_derivative, "type">,
  ): t.pallet_utility.pallet.Call.as_derivative {
    return { type: "as_derivative", ...value }
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
    value: Omit<t.pallet_utility.pallet.Call.batch_all, "type">,
  ): t.pallet_utility.pallet.Call.batch_all {
    return { type: "batch_all", ...value }
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
    value: Omit<t.pallet_utility.pallet.Call.dispatch_as, "type">,
  ): t.pallet_utility.pallet.Call.dispatch_as {
    return { type: "dispatch_as", ...value }
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
    value: Omit<t.pallet_utility.pallet.Call.force_batch, "type">,
  ): t.pallet_utility.pallet.Call.force_batch {
    return { type: "force_batch", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "TooManyCalls"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_utility.pallet.Event.BatchInterrupted
  | t.pallet_utility.pallet.Event.BatchCompleted
  | t.pallet_utility.pallet.Event.BatchCompletedWithErrors
  | t.pallet_utility.pallet.Event.ItemCompleted
  | t.pallet_utility.pallet.Event.ItemFailed
  | t.pallet_utility.pallet.Event.DispatchedAs
export namespace Event {
  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  export interface BatchInterrupted {
    type: "BatchInterrupted"
    index: t.u32
    error: t.sp_runtime.DispatchError
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
    error: t.sp_runtime.DispatchError
  }
  /** A call was dispatched. */
  export interface DispatchedAs {
    type: "DispatchedAs"
    result: null | ChainError<t.sp_runtime.DispatchError>
  }
  /**
   * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
   * well as the error.
   */
  export function BatchInterrupted(
    value: Omit<t.pallet_utility.pallet.Event.BatchInterrupted, "type">,
  ): t.pallet_utility.pallet.Event.BatchInterrupted {
    return { type: "BatchInterrupted", ...value }
  }
  /** Batch of dispatches completed fully with no error. */
  export function BatchCompleted(): t.pallet_utility.pallet.Event.BatchCompleted {
    return { type: "BatchCompleted" }
  }
  /** Batch of dispatches completed but has errors. */
  export function BatchCompletedWithErrors(): t.pallet_utility.pallet.Event.BatchCompletedWithErrors {
    return { type: "BatchCompletedWithErrors" }
  }
  /** A single item within a Batch of dispatches has completed with no error. */
  export function ItemCompleted(): t.pallet_utility.pallet.Event.ItemCompleted {
    return { type: "ItemCompleted" }
  }
  /** A single item within a Batch of dispatches has completed with error. */
  export function ItemFailed(
    value: Omit<t.pallet_utility.pallet.Event.ItemFailed, "type">,
  ): t.pallet_utility.pallet.Event.ItemFailed {
    return { type: "ItemFailed", ...value }
  }
  /** A call was dispatched. */
  export function DispatchedAs(
    value: Omit<t.pallet_utility.pallet.Event.DispatchedAs, "type">,
  ): t.pallet_utility.pallet.Event.DispatchedAs {
    return { type: "DispatchedAs", ...value }
  }
}
