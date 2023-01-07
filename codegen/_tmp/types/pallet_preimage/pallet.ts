import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_preimage.pallet.Call> = codecs.$184
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_preimage.pallet.Call.notePreimage
  | types.pallet_preimage.pallet.Call.unnotePreimage
  | types.pallet_preimage.pallet.Call.requestPreimage
  | types.pallet_preimage.pallet.Call.unrequestPreimage
export namespace Call {
  /**
   * Register a preimage on-chain.
   *
   * If the preimage was previously requested, no fees or deposits are taken for providing
   * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
   */
  export interface notePreimage {
    type: "notePreimage"
    bytes: Uint8Array
  }
  /** Clear an unrequested preimage from the runtime storage. */
  export interface unnotePreimage {
    type: "unnotePreimage"
    hash: types.primitive_types.H256
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export interface requestPreimage {
    type: "requestPreimage"
    hash: types.primitive_types.H256
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export interface unrequestPreimage {
    type: "unrequestPreimage"
    hash: types.primitive_types.H256
  }
  /**
   * Register a preimage on-chain.
   *
   * If the preimage was previously requested, no fees or deposits are taken for providing
   * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
   */
  export function notePreimage(
    value: Omit<types.pallet_preimage.pallet.Call.notePreimage, "type">,
  ): types.pallet_preimage.pallet.Call.notePreimage {
    return { type: "notePreimage", ...value }
  }
  /** Clear an unrequested preimage from the runtime storage. */
  export function unnotePreimage(
    value: Omit<types.pallet_preimage.pallet.Call.unnotePreimage, "type">,
  ): types.pallet_preimage.pallet.Call.unnotePreimage {
    return { type: "unnotePreimage", ...value }
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export function requestPreimage(
    value: Omit<types.pallet_preimage.pallet.Call.requestPreimage, "type">,
  ): types.pallet_preimage.pallet.Call.requestPreimage {
    return { type: "requestPreimage", ...value }
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export function unrequestPreimage(
    value: Omit<types.pallet_preimage.pallet.Call.unrequestPreimage, "type">,
  ): types.pallet_preimage.pallet.Call.unrequestPreimage {
    return { type: "unrequestPreimage", ...value }
  }
}

export const $error: $.Codec<types.pallet_preimage.pallet.Error> = codecs.$451
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "TooLarge"
  | "AlreadyNoted"
  | "NotAuthorized"
  | "NotNoted"
  | "Requested"
  | "NotRequested"

export const $event: $.Codec<types.pallet_preimage.pallet.Event> = codecs.$34
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_preimage.pallet.Event.Noted
  | types.pallet_preimage.pallet.Event.Requested
  | types.pallet_preimage.pallet.Event.Cleared
export namespace Event {
  /** A preimage has been noted. */
  export interface Noted {
    type: "Noted"
    hash: types.primitive_types.H256
  }
  /** A preimage has been requested. */
  export interface Requested {
    type: "Requested"
    hash: types.primitive_types.H256
  }
  /** A preimage has ben cleared. */
  export interface Cleared {
    type: "Cleared"
    hash: types.primitive_types.H256
  }
  /** A preimage has been noted. */
  export function Noted(
    value: Omit<types.pallet_preimage.pallet.Event.Noted, "type">,
  ): types.pallet_preimage.pallet.Event.Noted {
    return { type: "Noted", ...value }
  }
  /** A preimage has been requested. */
  export function Requested(
    value: Omit<types.pallet_preimage.pallet.Event.Requested, "type">,
  ): types.pallet_preimage.pallet.Event.Requested {
    return { type: "Requested", ...value }
  }
  /** A preimage has ben cleared. */
  export function Cleared(
    value: Omit<types.pallet_preimage.pallet.Event.Cleared, "type">,
  ): types.pallet_preimage.pallet.Event.Cleared {
    return { type: "Cleared", ...value }
  }
}
