import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  The last pruned session, if any. All data stored by this module
 *  references sessions.
 */
export const LastPrunedSession = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "ParasDisputes",
  "LastPrunedSession",
  $.tuple(),
  _codec.$4,
)

/** All ongoing or concluded disputes for the last several sessions. */
export const Disputes = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParasDisputes",
  "Disputes",
  _codec.$698,
  _codec.$699,
)

/**
 *  All included blocks on the chain, as well as the block number in this chain that
 *  should be reverted back to if the candidate is disputed and determined to be invalid.
 */
export const Included = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParasDisputes",
  "Included",
  _codec.$698,
  _codec.$4,
)

/**
 *  Maps session indices to a vector indicating the number of potentially-spam disputes
 *  each validator is participating in. Potentially-spam disputes are remote disputes which have
 *  fewer than `byzantine_threshold + 1` validators.
 *
 *  The i'th entry of the vector corresponds to the i'th validator in the session.
 */
export const SpamSlots = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ParasDisputes",
  "SpamSlots",
  $.tuple(_codec.$4),
  _codec.$94,
)

/**
 *  Whether the chain is frozen. Starts as `None`. When this is `Some`,
 *  the chain will not accept any new parachain blocks for backing or inclusion,
 *  and its value indicates the last valid block number in the chain.
 *  It can only be set back to `None` by governance intervention.
 */
export const Frozen = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ParasDisputes",
  "Frozen",
  $.tuple(),
  _codec.$236,
)

export function force_unfreeze(): types.polkadot_runtime.RuntimeCall {
  return { type: "ParasDisputes", value: "force_unfreeze" }
}
