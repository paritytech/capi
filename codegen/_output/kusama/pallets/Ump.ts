import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  The ordered list of `ParaId`s that have a `RelayDispatchQueue` entry.
 *
 *  Invariant:
 *  - The set of items from this vector should be exactly the set of the keys in
 *    `RelayDispatchQueues` and `RelayDispatchQueueSize`.
 */
export const NeedsDispatch = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$662,
}

/**
 *  This is the para that gets will get dispatched first during the next upward dispatchable queue
 *  execution round.
 *
 *  Invariant:
 *  - If `Some(para)`, then `para` must be present in `NeedsDispatch`.
 */
export const NextDispatchRoundStartWith = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$98,
}

/**
 *  The messages that exceeded max individual message weight budget.
 *
 *  These messages stay there until manually dispatched.
 */
export const Overweight = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$10),
  value: _codec.$684,
}

/**
 *  The number of overweight messages ever recorded in `Overweight` (and thus the lowest free
 *  index).
 */
export const OverweightCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$10,
}

/**
 *  Size of the dispatch queues. Caches sizes of the queues in `RelayDispatchQueue`.
 *
 *  First item in the tuple is the count of messages and second
 *  is the total length (in bytes) of the message payloads.
 *
 *  Note that this is an auxiliary mapping: it's possible to tell the byte size and the number of
 *  messages only looking at `RelayDispatchQueues`. This mapping is separate to avoid the cost of
 *  loading the whole message queue if only the total size and count are required.
 *
 *  Invariant:
 *  - The set of keys should exactly match the set of keys of `RelayDispatchQueues`.
 */
export const RelayDispatchQueueSize = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$30,
}

/**
 *  The messages waiting to be handled by the relay-chain originating from a certain parachain.
 *
 *  Note that some upward messages might have been already processed by the inclusion logic. E.g.
 *  channel management messages.
 *
 *  The messages are processed in FIFO order.
 */
export const RelayDispatchQueues = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$164,
}

/**
 * Service a single overweight upward message.
 *
 * - `origin`: Must pass `ExecuteOverweightOrigin`.
 * - `index`: The index of the overweight message to service.
 * - `weight_limit`: The amount of weight that message execution may take.
 *
 * Errors:
 * - `UnknownMessageIndex`: Message of `index` is unknown.
 * - `WeightOverLimit`: Message execution may use greater than `weight_limit`.
 *
 * Events:
 * - `OverweightServiced`: On success.
 */
export function service_overweight(
  value: Omit<t.polkadot_runtime_parachains.ump.pallet.Call.service_overweight, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Ump", value: { ...value, type: "service_overweight" } }
}
