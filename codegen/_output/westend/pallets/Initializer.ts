import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  Whether the parachains modules have been initialized within this block.
 *
 *  Semantically a `bool`, but this guarantees it should never hit the trie,
 *  as this is cleared in `on_finalize` and Frame optimizes `None` values to be empty values.
 *
 *  As a `bool`, `set(false)` and `remove()` both lead to the next `get()` being false, but one of
 *  them writes to the trie and one does not. This confusion makes `Option<()>` more suitable for
 *  the semantics of this variable.
 */
export const HasInitialized = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Initializer",
  "HasInitialized",
  $.tuple(),
  codecs.$33,
)

/**
 *  Buffered session changes along with the block number at which they should be applied.
 *
 *  Typically this will be empty or one element long. Apart from that this item never hits
 *  the storage.
 *
 *  However this is a `Vec` regardless to handle various edge cases that may occur at runtime
 *  upgrade boundaries or if governance intervenes.
 */
export const BufferedSessionChanges = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Initializer",
  "BufferedSessionChanges",
  $.tuple(),
  codecs.$680,
)

/**
 * Issue a signal to the consensus engine to forcibly act as though all parachain
 * blocks in all relay chain blocks up to and including the given number in the current
 * chain are valid and should be finalized.
 */
export function force_approve(
  value: Omit<types.polkadot_runtime_parachains.initializer.pallet.Call.force_approve, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Initializer", value: { ...value, type: "force_approve" } }
}
