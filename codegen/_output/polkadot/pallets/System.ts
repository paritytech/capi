import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
/** The full account information for a particular account ID. */
export const Account = {
  type: "Map",
  modifier: "Default",
  hashers: ["Blake2_128Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$3,
}

/** Total length (in bytes) for all extrinsics put together, for the current block. */
export const AllExtrinsicsLen = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Map of block numbers to block hashes. */
export const BlockHash = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$11,
}

/** The current weight for the block. */
export const BlockWeight = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$7,
}

/** Digest of the current block, also part of the block header. */
export const Digest = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$13,
}

/** The number of events in the `Events<T>` list. */
export const EventCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

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
export const EventTopics = {
  type: "Map",
  modifier: "Default",
  hashers: ["Blake2_128Concat"],
  key: $.tuple(_codec.$11),
  value: _codec.$158,
}

/**
 *  Events deposited for the current block.
 *
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 *
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export const Events = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$17,
}

/** The execution phase of the block. */
export const ExecutionPhase = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$156,
}

/** Total extrinsics count for the current block. */
export const ExtrinsicCount = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Extrinsics data for the current block (maps an extrinsic's index to its data). */
export const ExtrinsicData = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$12,
}

/** Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened. */
export const LastRuntimeUpgrade = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$159,
}

/** The current block number being processed. Set by `execute_block`. */
export const Number = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Hash of the previous block. */
export const ParentHash = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$11,
}

/**
 *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
 *  (default) if not.
 */
export const UpgradedToTripleRefCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$43,
}

/** True if we have upgraded so that `type RefCount` is `u32`. False (default) if not. */
export const UpgradedToU32RefCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$43,
}

/** A dispatch that will fill the block weight up to the given ratio. */
export function fill_block(
  value: Omit<t.frame_system.pallet.Call.fill_block, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "fill_block" } }
}

/**
 * Kill all storage items with a key that starts with the given prefix.
 *
 * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
 * the prefix we are removing to accurately calculate the weight of this function.
 */
export function kill_prefix(
  value: Omit<t.frame_system.pallet.Call.kill_prefix, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "kill_prefix" } }
}

/** Kill some items from storage. */
export function kill_storage(
  value: Omit<t.frame_system.pallet.Call.kill_storage, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "kill_storage" } }
}

/**
 * Make some on-chain remark.
 *
 * # <weight>
 * - `O(1)`
 * # </weight>
 */
export function remark(
  value: Omit<t.frame_system.pallet.Call.remark, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "remark" } }
}

/** Make some on-chain remark and emit event. */
export function remark_with_event(
  value: Omit<t.frame_system.pallet.Call.remark_with_event, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "remark_with_event" } }
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
export function set_code(
  value: Omit<t.frame_system.pallet.Call.set_code, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "set_code" } }
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
export function set_code_without_checks(
  value: Omit<t.frame_system.pallet.Call.set_code_without_checks, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "set_code_without_checks" } }
}

/** Set the number of pages in the WebAssembly environment's heap. */
export function set_heap_pages(
  value: Omit<t.frame_system.pallet.Call.set_heap_pages, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "set_heap_pages" } }
}

/** Set some items of storage. */
export function set_storage(
  value: Omit<t.frame_system.pallet.Call.set_storage, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "System", value: { ...value, type: "set_storage" } }
}
