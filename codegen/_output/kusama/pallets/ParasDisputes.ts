import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** All ongoing or concluded disputes for the last several sessions. */
export const Disputes = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Blake2_128Concat"],
  key: _codec.$698,
  value: _codec.$699,
}

/**
 *  Whether the chain is frozen. Starts as `None`. When this is `Some`,
 *  the chain will not accept any new parachain blocks for backing or inclusion,
 *  and its value indicates the last valid block number in the chain.
 *  It can only be set back to `None` by governance intervention.
 */
export const Frozen = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$236,
}

/**
 *  All included blocks on the chain, as well as the block number in this chain that
 *  should be reverted back to if the candidate is disputed and determined to be invalid.
 */
export const Included = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Blake2_128Concat"],
  key: _codec.$698,
  value: _codec.$4,
}

/**
 *  The last pruned session, if any. All data stored by this module
 *  references sessions.
 */
export const LastPrunedSession = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Maps session indices to a vector indicating the number of potentially-spam disputes
 *  each validator is participating in. Potentially-spam disputes are remote disputes which have
 *  fewer than `byzantine_threshold + 1` validators.
 *
 *  The i'th entry of the vector corresponds to the i'th validator in the session.
 */
export const SpamSlots = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$94,
}

export function force_unfreeze(): types.polkadot_runtime.RuntimeCall {
  return { type: "ParasDisputes", value: "force_unfreeze" }
}
