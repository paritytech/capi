import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const IncompleteSince = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Scheduler",
  "IncompleteSince",
  $.tuple(),
  _codec.$4,
)

/** Items to be executed, indexed by the block number that they should be executed on. */
export const Agenda = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Scheduler",
  "Agenda",
  $.tuple(_codec.$4),
  _codec.$177,
)

/**
 *  Lookup from a name to the block number and index of the task.
 *
 *  For v3 -> v4 the previously unbounded identities are Blake2-256 hashed to form the v4
 *  identities.
 */
export const Lookup = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Scheduler",
  "Lookup",
  $.tuple(_codec.$1),
  _codec.$30,
)

/** Anonymously schedule a task. */
export function schedule(
  value: Omit<types.pallet_scheduler.pallet.Call.schedule, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "schedule" } }
}

/** Cancel an anonymously scheduled task. */
export function cancel(
  value: Omit<types.pallet_scheduler.pallet.Call.cancel, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "cancel" } }
}

/** Schedule a named task. */
export function schedule_named(
  value: Omit<types.pallet_scheduler.pallet.Call.schedule_named, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "schedule_named" } }
}

/** Cancel a named scheduled task. */
export function cancel_named(
  value: Omit<types.pallet_scheduler.pallet.Call.cancel_named, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "cancel_named" } }
}

/**
 * Anonymously schedule a task after a delay.
 *
 * # <weight>
 * Same as [`schedule`].
 * # </weight>
 */
export function schedule_after(
  value: Omit<types.pallet_scheduler.pallet.Call.schedule_after, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "schedule_after" } }
}

/**
 * Schedule a named task after a delay.
 *
 * # <weight>
 * Same as [`schedule_named`](Self::schedule_named).
 * # </weight>
 */
export function schedule_named_after(
  value: Omit<types.pallet_scheduler.pallet.Call.schedule_named_after, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Scheduler", value: { ...value, type: "schedule_named_after" } }
}
