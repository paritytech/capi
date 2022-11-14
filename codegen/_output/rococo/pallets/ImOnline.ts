import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

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
export const HeartbeatAfter = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ImOnline",
  "HeartbeatAfter",
  $.tuple(),
  codecs.$4,
)

/** The current set of keys that may issue a heartbeat. */
export const Keys = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "ImOnline",
  "Keys",
  $.tuple(),
  codecs.$520,
)

/**
 *  For each session index, we keep a mapping of `SessionIndex` and `AuthIndex` to
 *  `WrapperOpaque<BoundedOpaqueNetworkState>`.
 */
export const ReceivedHeartbeats = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "ImOnline",
  "ReceivedHeartbeats",
  codecs.$30,
  codecs.$522,
)

/**
 *  For each session index, we keep a mapping of `ValidatorId<T>` to the
 *  number of blocks authored by the given authority.
 */
export const AuthoredBlocks = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "ImOnline",
  "AuthoredBlocks",
  codecs.$494,
  codecs.$4,
)

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
  value: Omit<types.pallet_im_online.pallet.Call.heartbeat, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "ImOnline", value: { ...value, type: "heartbeat" } }
}
