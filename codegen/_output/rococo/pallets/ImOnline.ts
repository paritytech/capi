import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
/**
 *  For each session index, we keep a mapping of `ValidatorId<T>` to the
 *  number of blocks authored by the given authority.
 */
export const AuthoredBlocks = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat", "Twox64Concat"],
  key: _codec.$494,
  value: _codec.$4,
}

/**
 *  The block number after which it's ok to send heartbeats in the current
 *  session.
 *
 *  At the beginning of each session we set this to a value that should fall
 *  roughly in the middle of the session duration. The idea is to first wait for
 *  the validators to produce a block in the current session, so that the
 *  heartbeat later on will not be necessary.
 *
 *  This value will only be used as a fallback if we fail to get a proper session
 *  progress estimate from `NextSessionRotation`, as those estimates should be
 *  more accurate then the value we calculate for `HeartbeatAfter`.
 */
export const HeartbeatAfter = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** The current set of keys that may issue a heartbeat. */
export const Keys = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$520,
}

/**
 *  For each session index, we keep a mapping of `SessionIndex` and `AuthIndex` to
 *  `WrapperOpaque<BoundedOpaqueNetworkState>`.
 */
export const ReceivedHeartbeats = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Twox64Concat"],
  key: _codec.$30,
  value: _codec.$522,
}

/**
 * # <weight>
 * - Complexity: `O(K + E)` where K is length of `Keys` (heartbeat.validators_len) and E is
 *   length of `heartbeat.network_state.external_address`
 *   - `O(K)`: decoding of length `K`
 *   - `O(E)`: decoding/encoding of length `E`
 * - DbReads: pallet_session `Validators`, pallet_session `CurrentIndex`, `Keys`,
 *   `ReceivedHeartbeats`
 * - DbWrites: `ReceivedHeartbeats`
 * # </weight>
 */
export function heartbeat(
  value: Omit<t.pallet_im_online.pallet.Call.heartbeat, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "ImOnline", value: { ...value, type: "heartbeat" } }
}
