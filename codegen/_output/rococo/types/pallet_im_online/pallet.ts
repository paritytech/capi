import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_im_online.pallet.Call> = _codec.$227

export const $error: $.Codec<t.types.pallet_im_online.pallet.Error> = _codec.$527

export const $event: $.Codec<t.types.pallet_im_online.pallet.Event> = _codec.$52

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call = t.types.pallet_im_online.pallet.Call.heartbeat
export namespace Call {
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
  export interface heartbeat {
    type: "heartbeat"
    heartbeat: t.types.pallet_im_online.Heartbeat
    signature: t.types.pallet_im_online.sr25519.app_sr25519.Signature
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
    value: Omit<t.types.pallet_im_online.pallet.Call.heartbeat, "type">,
  ): t.types.pallet_im_online.pallet.Call.heartbeat {
    return { type: "heartbeat", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "InvalidKey" | "DuplicatedHeartbeat"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.pallet_im_online.pallet.Event.HeartbeatReceived
  | t.types.pallet_im_online.pallet.Event.AllGood
  | t.types.pallet_im_online.pallet.Event.SomeOffline
export namespace Event {
  /** A new heartbeat was received from `AuthorityId`. */
  export interface HeartbeatReceived {
    type: "HeartbeatReceived"
    authority_id: t.types.pallet_im_online.sr25519.app_sr25519.Public
  }
  /** At the end of the session, no offence was committed. */
  export interface AllGood {
    type: "AllGood"
  }
  /** At the end of the session, at least one validator was found to be offline. */
  export interface SomeOffline {
    type: "SomeOffline"
    offline: Array<[t.types.sp_core.crypto.AccountId32, t.types.pallet_staking.Exposure]>
  }
  /** A new heartbeat was received from `AuthorityId`. */
  export function HeartbeatReceived(
    value: Omit<t.types.pallet_im_online.pallet.Event.HeartbeatReceived, "type">,
  ): t.types.pallet_im_online.pallet.Event.HeartbeatReceived {
    return { type: "HeartbeatReceived", ...value }
  }
  /** At the end of the session, no offence was committed. */
  export function AllGood(): t.types.pallet_im_online.pallet.Event.AllGood {
    return { type: "AllGood" }
  }
  /** At the end of the session, at least one validator was found to be offline. */
  export function SomeOffline(
    value: Omit<t.types.pallet_im_online.pallet.Event.SomeOffline, "type">,
  ): t.types.pallet_im_online.pallet.Event.SomeOffline {
    return { type: "SomeOffline", ...value }
  }
}
