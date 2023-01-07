import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Items to be executed, indexed by the block number that they should be executed on. */
export const Agenda = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Scheduler",
  "Agenda",
  $.tuple(codecs.$4),
  codecs.$177,
)

/** Lookup from identity to the block number and index of the task. */
export const Lookup = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Scheduler",
  "Lookup",
  $.tuple(codecs.$11),
  codecs.$29,
)

/** Anonymously schedule a task. */
export function schedule(value: Omit<types.pallet_scheduler.pallet.Call.schedule, "type">) {
  return { type: "Scheduler", value: { ...value, type: "schedule" } }
}

/** Cancel an anonymously scheduled task. */
export function cancel(value: Omit<types.pallet_scheduler.pallet.Call.cancel, "type">) {
  return { type: "Scheduler", value: { ...value, type: "cancel" } }
}

/** Schedule a named task. */
export function scheduleNamed(
  value: Omit<types.pallet_scheduler.pallet.Call.scheduleNamed, "type">,
) {
  return { type: "Scheduler", value: { ...value, type: "scheduleNamed" } }
}

/** Cancel a named scheduled task. */
export function cancelNamed(value: Omit<types.pallet_scheduler.pallet.Call.cancelNamed, "type">) {
  return { type: "Scheduler", value: { ...value, type: "cancelNamed" } }
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
) {
  return { type: "Scheduler", value: { ...value, type: "scheduleAfter" } }
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
) {
  return { type: "Scheduler", value: { ...value, type: "scheduleNamedAfter" } }
}

/**
 *  The maximum weight that may be scheduled per block for any dispatchables of less
 *  priority than `schedule::HARD_DEADLINE`.
 */
export const MaximumWeight: types.frame_support.weights.weight_v2.Weight = codecs.$8.decode(
  C.hex.decode("00806e8774010000" as C.Hex),
)

/**
 *  The maximum number of scheduled calls in the queue for a single block.
 *  Not strictly enforced, but used for weight estimation.
 */
export const MaxScheduledPerBlock: types.u32 = codecs.$4.decode(C.hex.decode("32000000" as C.Hex))
