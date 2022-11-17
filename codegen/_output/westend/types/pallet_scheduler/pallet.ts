import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_scheduler.pallet.Call.schedule
  | types.pallet_scheduler.pallet.Call.cancel
  | types.pallet_scheduler.pallet.Call.scheduleNamed
  | types.pallet_scheduler.pallet.Call.cancelNamed
  | types.pallet_scheduler.pallet.Call.scheduleAfter
  | types.pallet_scheduler.pallet.Call.scheduleNamedAfter
export namespace Call {
  /** Anonymously schedule a task. */
  export interface schedule {
    type: "schedule"
    when: types.u32
    maybePeriodic: [types.u32, types.u32] | undefined
    priority: types.u8
    call: types.polkadot_runtime.RuntimeCall
  }
  /** Cancel an anonymously scheduled task. */
  export interface cancel {
    type: "cancel"
    when: types.u32
    index: types.u32
  }
  /** Schedule a named task. */
  export interface scheduleNamed {
    type: "scheduleNamed"
    id: Uint8Array
    when: types.u32
    maybePeriodic: [types.u32, types.u32] | undefined
    priority: types.u8
    call: types.polkadot_runtime.RuntimeCall
  }
  /** Cancel a named scheduled task. */
  export interface cancelNamed {
    type: "cancelNamed"
    id: Uint8Array
  }
  /**
   * Anonymously schedule a task after a delay.
   *
   * # <weight>
   * Same as [`schedule`].
   * # </weight>
   */
  export interface scheduleAfter {
    type: "scheduleAfter"
    after: types.u32
    maybePeriodic: [types.u32, types.u32] | undefined
    priority: types.u8
    call: types.polkadot_runtime.RuntimeCall
  }
  /**
   * Schedule a named task after a delay.
   *
   * # <weight>
   * Same as [`schedule_named`](Self::schedule_named).
   * # </weight>
   */
  export interface scheduleNamedAfter {
    type: "scheduleNamedAfter"
    id: Uint8Array
    after: types.u32
    maybePeriodic: [types.u32, types.u32] | undefined
    priority: types.u8
    call: types.polkadot_runtime.RuntimeCall
  }
  /** Anonymously schedule a task. */
  export function schedule(
    value: Omit<types.pallet_scheduler.pallet.Call.schedule, "type">,
  ): types.pallet_scheduler.pallet.Call.schedule {
    return { type: "schedule", ...value }
  }
  /** Cancel an anonymously scheduled task. */
  export function cancel(
    value: Omit<types.pallet_scheduler.pallet.Call.cancel, "type">,
  ): types.pallet_scheduler.pallet.Call.cancel {
    return { type: "cancel", ...value }
  }
  /** Schedule a named task. */
  export function scheduleNamed(
    value: Omit<types.pallet_scheduler.pallet.Call.scheduleNamed, "type">,
  ): types.pallet_scheduler.pallet.Call.scheduleNamed {
    return { type: "scheduleNamed", ...value }
  }
  /** Cancel a named scheduled task. */
  export function cancelNamed(
    value: Omit<types.pallet_scheduler.pallet.Call.cancelNamed, "type">,
  ): types.pallet_scheduler.pallet.Call.cancelNamed {
    return { type: "cancelNamed", ...value }
  }
  /**
   * Anonymously schedule a task after a delay.
   *
   * # <weight>
   * Same as [`schedule`].
   * # </weight>
   */
  export function scheduleAfter(
    value: Omit<types.pallet_scheduler.pallet.Call.scheduleAfter, "type">,
  ): types.pallet_scheduler.pallet.Call.scheduleAfter {
    return { type: "scheduleAfter", ...value }
  }
  /**
   * Schedule a named task after a delay.
   *
   * # <weight>
   * Same as [`schedule_named`](Self::schedule_named).
   * # </weight>
   */
  export function scheduleNamedAfter(
    value: Omit<types.pallet_scheduler.pallet.Call.scheduleNamedAfter, "type">,
  ): types.pallet_scheduler.pallet.Call.scheduleNamedAfter {
    return { type: "scheduleNamedAfter", ...value }
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
  | types.pallet_scheduler.pallet.Event.Scheduled
  | types.pallet_scheduler.pallet.Event.Canceled
  | types.pallet_scheduler.pallet.Event.Dispatched
  | types.pallet_scheduler.pallet.Event.CallUnavailable
  | types.pallet_scheduler.pallet.Event.PeriodicFailed
  | types.pallet_scheduler.pallet.Event.PermanentlyOverweight
export namespace Event {
  /** Scheduled some task. */
  export interface Scheduled {
    type: "Scheduled"
    when: types.u32
    index: types.u32
  }
  /** Canceled some task. */
  export interface Canceled {
    type: "Canceled"
    when: types.u32
    index: types.u32
  }
  /** Dispatched some task. */
  export interface Dispatched {
    type: "Dispatched"
    task: [types.u32, types.u32]
    id: Uint8Array | undefined
    result: null | C.ChainError<types.sp_runtime.DispatchError>
  }
  /** The call for the provided hash was not found so the task has been aborted. */
  export interface CallUnavailable {
    type: "CallUnavailable"
    task: [types.u32, types.u32]
    id: Uint8Array | undefined
  }
  /** The given task was unable to be renewed since the agenda is full at that block. */
  export interface PeriodicFailed {
    type: "PeriodicFailed"
    task: [types.u32, types.u32]
    id: Uint8Array | undefined
  }
  /** The given task can never be executed since it is overweight. */
  export interface PermanentlyOverweight {
    type: "PermanentlyOverweight"
    task: [types.u32, types.u32]
    id: Uint8Array | undefined
  }
  /** Scheduled some task. */
  export function Scheduled(
    value: Omit<types.pallet_scheduler.pallet.Event.Scheduled, "type">,
  ): types.pallet_scheduler.pallet.Event.Scheduled {
    return { type: "Scheduled", ...value }
  }
  /** Canceled some task. */
  export function Canceled(
    value: Omit<types.pallet_scheduler.pallet.Event.Canceled, "type">,
  ): types.pallet_scheduler.pallet.Event.Canceled {
    return { type: "Canceled", ...value }
  }
  /** Dispatched some task. */
  export function Dispatched(
    value: Omit<types.pallet_scheduler.pallet.Event.Dispatched, "type">,
  ): types.pallet_scheduler.pallet.Event.Dispatched {
    return { type: "Dispatched", ...value }
  }
  /** The call for the provided hash was not found so the task has been aborted. */
  export function CallUnavailable(
    value: Omit<types.pallet_scheduler.pallet.Event.CallUnavailable, "type">,
  ): types.pallet_scheduler.pallet.Event.CallUnavailable {
    return { type: "CallUnavailable", ...value }
  }
  /** The given task was unable to be renewed since the agenda is full at that block. */
  export function PeriodicFailed(
    value: Omit<types.pallet_scheduler.pallet.Event.PeriodicFailed, "type">,
  ): types.pallet_scheduler.pallet.Event.PeriodicFailed {
    return { type: "PeriodicFailed", ...value }
  }
  /** The given task can never be executed since it is overweight. */
  export function PermanentlyOverweight(
    value: Omit<types.pallet_scheduler.pallet.Event.PermanentlyOverweight, "type">,
  ): types.pallet_scheduler.pallet.Event.PermanentlyOverweight {
    return { type: "PermanentlyOverweight", ...value }
  }
}
