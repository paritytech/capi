import { $, C } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_scheduler.pallet.Call> = _codec.$182

export const $error: $.Codec<t.pallet_scheduler.pallet.Error> = _codec.$450

export const $event: $.Codec<t.pallet_scheduler.pallet.Event> = _codec.$29

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_scheduler.pallet.Call.schedule
  | t.pallet_scheduler.pallet.Call.cancel
  | t.pallet_scheduler.pallet.Call.schedule_named
  | t.pallet_scheduler.pallet.Call.cancel_named
  | t.pallet_scheduler.pallet.Call.schedule_after
  | t.pallet_scheduler.pallet.Call.schedule_named_after
export namespace Call {
  /** Anonymously schedule a task. */
  export interface schedule {
    type: "schedule"
    when: t.u32
    maybe_periodic: [t.u32, t.u32] | undefined
    priority: t.u8
    call: t.polkadot_runtime.RuntimeCall
  }
  /** Cancel an anonymously scheduled task. */
  export interface cancel {
    type: "cancel"
    when: t.u32
    index: t.u32
  }
  /** Schedule a named task. */
  export interface schedule_named {
    type: "schedule_named"
    id: Uint8Array
    when: t.u32
    maybe_periodic: [t.u32, t.u32] | undefined
    priority: t.u8
    call: t.polkadot_runtime.RuntimeCall
  }
  /** Cancel a named scheduled task. */
  export interface cancel_named {
    type: "cancel_named"
    id: Uint8Array
  }
  /**
   * Anonymously schedule a task after a delay.
   *
   * # <weight>
   * Same as [`schedule`].
   * # </weight>
   */
  export interface schedule_after {
    type: "schedule_after"
    after: t.u32
    maybe_periodic: [t.u32, t.u32] | undefined
    priority: t.u8
    call: t.polkadot_runtime.RuntimeCall
  }
  /**
   * Schedule a named task after a delay.
   *
   * # <weight>
   * Same as [`schedule_named`](Self::schedule_named).
   * # </weight>
   */
  export interface schedule_named_after {
    type: "schedule_named_after"
    id: Uint8Array
    after: t.u32
    maybe_periodic: [t.u32, t.u32] | undefined
    priority: t.u8
    call: t.polkadot_runtime.RuntimeCall
  }
  /** Anonymously schedule a task. */
  export function schedule(
    value: Omit<t.pallet_scheduler.pallet.Call.schedule, "type">,
  ): t.pallet_scheduler.pallet.Call.schedule {
    return { type: "schedule", ...value }
  }
  /** Cancel an anonymously scheduled task. */
  export function cancel(
    value: Omit<t.pallet_scheduler.pallet.Call.cancel, "type">,
  ): t.pallet_scheduler.pallet.Call.cancel {
    return { type: "cancel", ...value }
  }
  /** Schedule a named task. */
  export function schedule_named(
    value: Omit<t.pallet_scheduler.pallet.Call.schedule_named, "type">,
  ): t.pallet_scheduler.pallet.Call.schedule_named {
    return { type: "schedule_named", ...value }
  }
  /** Cancel a named scheduled task. */
  export function cancel_named(
    value: Omit<t.pallet_scheduler.pallet.Call.cancel_named, "type">,
  ): t.pallet_scheduler.pallet.Call.cancel_named {
    return { type: "cancel_named", ...value }
  }
  /**
   * Anonymously schedule a task after a delay.
   *
   * # <weight>
   * Same as [`schedule`].
   * # </weight>
   */
  export function schedule_after(
    value: Omit<t.pallet_scheduler.pallet.Call.schedule_after, "type">,
  ): t.pallet_scheduler.pallet.Call.schedule_after {
    return { type: "schedule_after", ...value }
  }
  /**
   * Schedule a named task after a delay.
   *
   * # <weight>
   * Same as [`schedule_named`](Self::schedule_named).
   * # </weight>
   */
  export function schedule_named_after(
    value: Omit<t.pallet_scheduler.pallet.Call.schedule_named_after, "type">,
  ): t.pallet_scheduler.pallet.Call.schedule_named_after {
    return { type: "schedule_named_after", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "FailedToSchedule"
  | "NotFound"
  | "TargetBlockNumberInPast"
  | "RescheduleNoChange"
  | "Named"

/** Events type. */
export type Event =
  | t.pallet_scheduler.pallet.Event.Scheduled
  | t.pallet_scheduler.pallet.Event.Canceled
  | t.pallet_scheduler.pallet.Event.Dispatched
  | t.pallet_scheduler.pallet.Event.CallUnavailable
  | t.pallet_scheduler.pallet.Event.PeriodicFailed
  | t.pallet_scheduler.pallet.Event.PermanentlyOverweight
export namespace Event {
  /** Scheduled some task. */
  export interface Scheduled {
    type: "Scheduled"
    when: t.u32
    index: t.u32
  }
  /** Canceled some task. */
  export interface Canceled {
    type: "Canceled"
    when: t.u32
    index: t.u32
  }
  /** Dispatched some task. */
  export interface Dispatched {
    type: "Dispatched"
    task: [t.u32, t.u32]
    id: Uint8Array | undefined
    result: null | C.ChainError<t.sp_runtime.DispatchError>
  }
  /** The call for the provided hash was not found so the task has been aborted. */
  export interface CallUnavailable {
    type: "CallUnavailable"
    task: [t.u32, t.u32]
    id: Uint8Array | undefined
  }
  /** The given task was unable to be renewed since the agenda is full at that block. */
  export interface PeriodicFailed {
    type: "PeriodicFailed"
    task: [t.u32, t.u32]
    id: Uint8Array | undefined
  }
  /** The given task can never be executed since it is overweight. */
  export interface PermanentlyOverweight {
    type: "PermanentlyOverweight"
    task: [t.u32, t.u32]
    id: Uint8Array | undefined
  }
  /** Scheduled some task. */
  export function Scheduled(
    value: Omit<t.pallet_scheduler.pallet.Event.Scheduled, "type">,
  ): t.pallet_scheduler.pallet.Event.Scheduled {
    return { type: "Scheduled", ...value }
  }
  /** Canceled some task. */
  export function Canceled(
    value: Omit<t.pallet_scheduler.pallet.Event.Canceled, "type">,
  ): t.pallet_scheduler.pallet.Event.Canceled {
    return { type: "Canceled", ...value }
  }
  /** Dispatched some task. */
  export function Dispatched(
    value: Omit<t.pallet_scheduler.pallet.Event.Dispatched, "type">,
  ): t.pallet_scheduler.pallet.Event.Dispatched {
    return { type: "Dispatched", ...value }
  }
  /** The call for the provided hash was not found so the task has been aborted. */
  export function CallUnavailable(
    value: Omit<t.pallet_scheduler.pallet.Event.CallUnavailable, "type">,
  ): t.pallet_scheduler.pallet.Event.CallUnavailable {
    return { type: "CallUnavailable", ...value }
  }
  /** The given task was unable to be renewed since the agenda is full at that block. */
  export function PeriodicFailed(
    value: Omit<t.pallet_scheduler.pallet.Event.PeriodicFailed, "type">,
  ): t.pallet_scheduler.pallet.Event.PeriodicFailed {
    return { type: "PeriodicFailed", ...value }
  }
  /** The given task can never be executed since it is overweight. */
  export function PermanentlyOverweight(
    value: Omit<t.pallet_scheduler.pallet.Event.PermanentlyOverweight, "type">,
  ): t.pallet_scheduler.pallet.Event.PermanentlyOverweight {
    return { type: "PermanentlyOverweight", ...value }
  }
}
