import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  A single node, within some bag.
 *
 *  Nodes store links forward and back within their respective bags.
 */
export const ListNodes = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "VoterList",
  "ListNodes",
  $.tuple(codecs.$0),
  codecs.$612,
)

/** Counter for the related counted storage map */
export const CounterForListNodes = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "VoterList",
  "CounterForListNodes",
  $.tuple(),
  codecs.$4,
)

/**
 *  A bag stored in storage.
 *
 *  Stores a `Bag` struct, which stores head and tail pointers to itself.
 */
export const ListBags = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "VoterList",
  "ListBags",
  $.tuple(codecs.$10),
  codecs.$613,
)

/**
 * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
 * changed its score that it should properly fall into a different bag than its current
 * one.
 *
 * Anyone can call this function about any potentially dislocated account.
 *
 * Will always update the stored score of `dislocated` to the correct score, based on
 * `ScoreProvider`.
 *
 * If `dislocated` does not exists, it returns an error.
 */
export function rebag(
  value: Omit<types.pallet_bags_list.pallet.Call.rebag, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "VoterList", value: { ...value, type: "rebag" } }
}

/**
 * Move the caller's Id directly in front of `lighter`.
 *
 * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
 * the account going in front of `lighter`.
 *
 * Only works if
 * - both nodes are within the same bag,
 * - and `origin` has a greater `Score` than `lighter`.
 */
export function put_in_front_of(
  value: Omit<types.pallet_bags_list.pallet.Call.put_in_front_of, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "VoterList", value: { ...value, type: "put_in_front_of" } }
}
