import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_preimage.pallet.Call.note_preimage
  | types.pallet_preimage.pallet.Call.unnote_preimage
  | types.pallet_preimage.pallet.Call.request_preimage
  | types.pallet_preimage.pallet.Call.unrequest_preimage
export namespace Call {
  /**
   * Register a preimage on-chain.
   *
   * If the preimage was previously requested, no fees or deposits are taken for providing
   * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
   */
  export interface note_preimage {
    type: "note_preimage"
    bytes: Uint8Array
  }
  /**
   * Clear an unrequested preimage from the runtime storage.
   *
   * If `len` is provided, then it will be a much cheaper operation.
   *
   * - `hash`: The hash of the preimage to be removed from the store.
   * - `len`: The length of the preimage of `hash`.
   */
  export interface unnote_preimage {
    type: "unnote_preimage"
    hash: types.primitive_types.H256
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export interface request_preimage {
    type: "request_preimage"
    hash: types.primitive_types.H256
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export interface unrequest_preimage {
    type: "unrequest_preimage"
    hash: types.primitive_types.H256
  }
  /**
   * Register a preimage on-chain.
   *
   * If the preimage was previously requested, no fees or deposits are taken for providing
   * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
   */
  export function note_preimage(
    value: Omit<types.pallet_preimage.pallet.Call.note_preimage, "type">,
  ): types.pallet_preimage.pallet.Call.note_preimage {
    return { type: "note_preimage", ...value }
  }
  /**
   * Clear an unrequested preimage from the runtime storage.
   *
   * If `len` is provided, then it will be a much cheaper operation.
   *
   * - `hash`: The hash of the preimage to be removed from the store.
   * - `len`: The length of the preimage of `hash`.
   */
  export function unnote_preimage(
    value: Omit<types.pallet_preimage.pallet.Call.unnote_preimage, "type">,
  ): types.pallet_preimage.pallet.Call.unnote_preimage {
    return { type: "unnote_preimage", ...value }
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export function request_preimage(
    value: Omit<types.pallet_preimage.pallet.Call.request_preimage, "type">,
  ): types.pallet_preimage.pallet.Call.request_preimage {
    return { type: "request_preimage", ...value }
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export function unrequest_preimage(
    value: Omit<types.pallet_preimage.pallet.Call.unrequest_preimage, "type">,
  ): types.pallet_preimage.pallet.Call.unrequest_preimage {
    return { type: "unrequest_preimage", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "TooBig"
  | "AlreadyNoted"
  | "NotAuthorized"
  | "NotNoted"
  | "Requested"
  | "NotRequested"
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
