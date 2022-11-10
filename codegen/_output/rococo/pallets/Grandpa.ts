import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  The number of changes (both in terms of keys and underlying economic responsibilities)
 *  in the "set" of Grandpa validators from genesis.
 */
export const CurrentSetId = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$10,
}

/** next block number where we can force a change. */
export const NextForced = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Pending change: (signaled at, scheduled change). */
export const PendingChange = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$517,
}

/**
 *  A mapping from grandpa set ID to the index of the *most recent* session for which its
 *  members were responsible.
 *
 *  TWOX-NOTE: `SetId` is not under user control.
 */
export const SetIdSession = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$10),
  value: _codec.$4,
}

/** `true` if we are currently stalled. */
export const Stalled = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$30,
}

/** State of the current authority set. */
export const State = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$516,
}

/**
 * Note that the current authority set of the GRANDPA finality gadget has stalled.
 *
 * This will trigger a forced authority set change at the beginning of the next session, to
 * be enacted `delay` blocks after that. The `delay` should be high enough to safely assume
 * that the block signalling the forced change will not be re-orged e.g. 1000 blocks.
 * The block production rate (which may be slowed down because of finality lagging) should
 * be taken into account when choosing the `delay`. The GRANDPA voters based on the new
 * authority will start voting on top of `best_finalized_block_number` for new finalized
 * blocks. `best_finalized_block_number` should be the highest of the latest finalized
 * block of all validators of the new authority set.
 *
 * Only callable by root.
 */
export function note_stalled(
  value: Omit<t.types.pallet_grandpa.pallet.Call.note_stalled, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Grandpa", value: { ...value, type: "note_stalled" } }
}

/**
 * Report voter equivocation/misbehavior. This method will verify the
 * equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence
 * will be reported.
 */
export function report_equivocation(
  value: Omit<t.types.pallet_grandpa.pallet.Call.report_equivocation, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Grandpa", value: { ...value, type: "report_equivocation" } }
}

/**
 * Report voter equivocation/misbehavior. This method will verify the
 * equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence
 * will be reported.
 *
 * This extrinsic must be called unsigned and it is expected that only
 * block authors will call it (validated in `ValidateUnsigned`), as such
 * if the block author is defined it will be defined as the equivocation
 * reporter.
 */
export function report_equivocation_unsigned(
  value: Omit<t.types.pallet_grandpa.pallet.Call.report_equivocation_unsigned, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Grandpa", value: { ...value, type: "report_equivocation_unsigned" } }
}
