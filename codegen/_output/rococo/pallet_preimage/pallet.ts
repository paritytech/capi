import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"
export const $call: $.Codec<t.pallet_preimage.pallet.Call> = _codec.$184

export const $error: $.Codec<t.pallet_preimage.pallet.Error> = _codec.$455

export const $event: $.Codec<t.pallet_preimage.pallet.Event> = _codec.$34

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_preimage.pallet.Call.note_preimage
  | t.pallet_preimage.pallet.Call.unnote_preimage
  | t.pallet_preimage.pallet.Call.request_preimage
  | t.pallet_preimage.pallet.Call.unrequest_preimage
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
    hash: t.primitive_types.H256
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export interface request_preimage {
    type: "request_preimage"
    hash: t.primitive_types.H256
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export interface unrequest_preimage {
    type: "unrequest_preimage"
    hash: t.primitive_types.H256
  }
  /**
   * Register a preimage on-chain.
   *
   * If the preimage was previously requested, no fees or deposits are taken for providing
   * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
   */
  export function note_preimage(
    value: Omit<t.pallet_preimage.pallet.Call.note_preimage, "type">,
  ): t.pallet_preimage.pallet.Call.note_preimage {
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
    value: Omit<t.pallet_preimage.pallet.Call.unnote_preimage, "type">,
  ): t.pallet_preimage.pallet.Call.unnote_preimage {
    return { type: "unnote_preimage", ...value }
  }
  /**
   * Request a preimage be uploaded to the chain without paying any fees or deposits.
   *
   * If the preimage requests has already been provided on-chain, we unreserve any deposit
   * a user may have paid, and take the control of the preimage out of their hands.
   */
  export function request_preimage(
    value: Omit<t.pallet_preimage.pallet.Call.request_preimage, "type">,
  ): t.pallet_preimage.pallet.Call.request_preimage {
    return { type: "request_preimage", ...value }
  }
  /**
   * Clear a previously made request for a preimage.
   *
   * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
   */
  export function unrequest_preimage(
    value: Omit<t.pallet_preimage.pallet.Call.unrequest_preimage, "type">,
  ): t.pallet_preimage.pallet.Call.unrequest_preimage {
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
  | t.pallet_preimage.pallet.Event.Noted
  | t.pallet_preimage.pallet.Event.Requested
  | t.pallet_preimage.pallet.Event.Cleared
export namespace Event {
  /** A preimage has been noted. */
  export interface Noted {
    type: "Noted"
    hash: t.primitive_types.H256
  }
  /** A preimage has been requested. */
  export interface Requested {
    type: "Requested"
    hash: t.primitive_types.H256
  }
  /** A preimage has ben cleared. */
  export interface Cleared {
    type: "Cleared"
    hash: t.primitive_types.H256
  }
  /** A preimage has been noted. */
  export function Noted(
    value: Omit<t.pallet_preimage.pallet.Event.Noted, "type">,
  ): t.pallet_preimage.pallet.Event.Noted {
    return { type: "Noted", ...value }
  }
  /** A preimage has been requested. */
  export function Requested(
    value: Omit<t.pallet_preimage.pallet.Event.Requested, "type">,
  ): t.pallet_preimage.pallet.Event.Requested {
    return { type: "Requested", ...value }
  }
  /** A preimage has ben cleared. */
  export function Cleared(
    value: Omit<t.pallet_preimage.pallet.Event.Cleared, "type">,
  ): t.pallet_preimage.pallet.Event.Cleared {
    return { type: "Cleared", ...value }
  }
}
