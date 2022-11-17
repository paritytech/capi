import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The full account information for a particular account ID. */
export const Account = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "System",
  "Account",
  $.tuple(codecs.$0),
  codecs.$3,
)

/** Total extrinsics count for the current block. */
export const ExtrinsicCount = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "System",
  "ExtrinsicCount",
  $.tuple(),
  codecs.$4,
)

/** The current weight for the block. */
export const BlockWeight = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "BlockWeight",
  $.tuple(),
  codecs.$7,
)

/** Total length (in bytes) for all extrinsics put together, for the current block. */
export const AllExtrinsicsLen = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "System",
  "AllExtrinsicsLen",
  $.tuple(),
  codecs.$4,
)

/** Map of block numbers to block hashes. */
export const BlockHash = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "System",
  "BlockHash",
  $.tuple(codecs.$4),
  codecs.$11,
)

/** Extrinsics data for the current block (maps an extrinsic's index to its data). */
export const ExtrinsicData = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "System",
  "ExtrinsicData",
  $.tuple(codecs.$4),
  codecs.$12,
)

/** The current block number being processed. Set by `execute_block`. */
export const Number = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "Number",
  $.tuple(),
  codecs.$4,
)

/** Hash of the previous block. */
export const ParentHash = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "ParentHash",
  $.tuple(),
  codecs.$11,
)

/** Digest of the current block, also part of the block header. */
export const Digest = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "Digest",
  $.tuple(),
  codecs.$13,
)

/**
 *  Events deposited for the current block.
 *
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 *
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export const Events = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "Events",
  $.tuple(),
  codecs.$17,
)

/** The number of events in the `Events<T>` list. */
export const EventCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "EventCount",
  $.tuple(),
  codecs.$4,
)

/**
 *  Mapping between a topic (represented by T::Hash) and a vector of indexes
 *  of events in the `<Events<T>>` list.
 *
 *  All topic vectors have deterministic storage locations depending on the topic. This
 *  allows light-clients to leverage the changes trie storage tracking mechanism and
 *  in case of changes fetch the list of events of interest.
 *
 *  The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
 *  the `EventIndex` then in case if the topic has the same contents on the next block
 *  no notification will be triggered thus the event might be lost.
 */
export const EventTopics = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "System",
  "EventTopics",
  $.tuple(codecs.$11),
  codecs.$158,
)

/** Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened. */
export const LastRuntimeUpgrade = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "System",
  "LastRuntimeUpgrade",
  $.tuple(),
  codecs.$159,
)

/** True if we have upgraded so that `type RefCount` is `u32`. False (default) if not. */
export const UpgradedToU32RefCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "UpgradedToU32RefCount",
  $.tuple(),
  codecs.$43,
)

/**
 *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
 *  (default) if not.
 */
export const UpgradedToTripleRefCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "System",
  "UpgradedToTripleRefCount",
  $.tuple(),
  codecs.$43,
)

/** The execution phase of the block. */
export const ExecutionPhase = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "System",
  "ExecutionPhase",
  $.tuple(),
  codecs.$156,
)

/** A dispatch that will fill the block weight up to the given ratio. */
export function fillBlock(
  value: Omit<types.frame_system.pallet.Call.fillBlock, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "fillBlock" } }
}

/**
 * Make some on-chain remark.
 *
 * # <weight>
 * - `O(1)`
 * # </weight>
 */
export function remark(
  value: Omit<types.frame_system.pallet.Call.remark, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "remark" } }
}

/** Set the number of pages in the WebAssembly environment's heap. */
export function setHeapPages(
  value: Omit<types.frame_system.pallet.Call.setHeapPages, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "setHeapPages" } }
}

/**
 * Set the new runtime code.
 *
 * # <weight>
 * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
 * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version` which is
 *   expensive).
 * - 1 storage write (codec `O(C)`).
 * - 1 digest item.
 * - 1 event.
 * The weight of this function is dependent on the runtime, but generally this is very
 * expensive. We will treat this as a full block.
 * # </weight>
 */
export function setCode(
  value: Omit<types.frame_system.pallet.Call.setCode, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "setCode" } }
}

/**
 * Set the new runtime code without doing any checks of the given `code`.
 *
 * # <weight>
 * - `O(C)` where `C` length of `code`
 * - 1 storage write (codec `O(C)`).
 * - 1 digest item.
 * - 1 event.
 * The weight of this function is dependent on the runtime. We will treat this as a full
 * block. # </weight>
 */
export function setCodeWithoutChecks(
  value: Omit<types.frame_system.pallet.Call.setCodeWithoutChecks, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "setCodeWithoutChecks" } }
}

/** Set some items of storage. */
export function setStorage(
  value: Omit<types.frame_system.pallet.Call.setStorage, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "setStorage" } }
}

/** Kill some items from storage. */
export function killStorage(
  value: Omit<types.frame_system.pallet.Call.killStorage, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "killStorage" } }
}

/**
 * Kill all storage items with a key that starts with the given prefix.
 *
 * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
 * the prefix we are removing to accurately calculate the weight of this function.
 */
export function killPrefix(
  value: Omit<types.frame_system.pallet.Call.killPrefix, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "killPrefix" } }
}

/** Make some on-chain remark and emit event. */
export function remarkWithEvent(
  value: Omit<types.frame_system.pallet.Call.remarkWithEvent, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "remarkWithEvent" } }
}
