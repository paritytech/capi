import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_bags_list.pallet.Call> = _codec.$368

export const $error: $.Codec<t.pallet_bags_list.pallet.Error> = _codec.$615

export const $event: $.Codec<t.pallet_bags_list.pallet.Event> = _codec.$89

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_bags_list.pallet.Call.rebag
  | t.pallet_bags_list.pallet.Call.put_in_front_of
export namespace Call {
  /**
   * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
   * changed its score that it should properly fall into a different bag than its current
   * one.
   *
   * Anyone can call this function about any potentially dislocated account.
   *
   * Will always update the stored score of `dislocated` to the correct score, based on
   * `ScoreProvider`.
   *
   * If `dislocated` does not exists, it returns an error.
   */
  export interface rebag {
    type: "rebag"
    dislocated: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Move the caller's Id directly in front of `lighter`.
   *
   * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
   * the account going in front of `lighter`.
   *
   * Only works if
   * - both nodes are within the same bag,
   * - and `origin` has a greater `Score` than `lighter`.
   */
  export interface put_in_front_of {
    type: "put_in_front_of"
    lighter: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Declare that some `dislocated` account has, through rewards or penalties, sufficiently
   * changed its score that it should properly fall into a different bag than its current
   * one.
   *
   * Anyone can call this function about any potentially dislocated account.
   *
   * Will always update the stored score of `dislocated` to the correct score, based on
   * `ScoreProvider`.
   *
   * If `dislocated` does not exists, it returns an error.
   */
  export function rebag(
    value: Omit<t.pallet_bags_list.pallet.Call.rebag, "type">,
  ): t.pallet_bags_list.pallet.Call.rebag {
    return { type: "rebag", ...value }
  }
  /**
   * Move the caller's Id directly in front of `lighter`.
   *
   * The dispatch origin for this call must be _Signed_ and can only be called by the Id of
   * the account going in front of `lighter`.
   *
   * Only works if
   * - both nodes are within the same bag,
   * - and `origin` has a greater `Score` than `lighter`.
   */
  export function put_in_front_of(
    value: Omit<t.pallet_bags_list.pallet.Call.put_in_front_of, "type">,
  ): t.pallet_bags_list.pallet.Call.put_in_front_of {
    return { type: "put_in_front_of", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = t.pallet_bags_list.pallet.Error.List
export namespace Error {
  /** A error in the list interface implementation. */
  export interface List {
    type: "List"
    value: t.pallet_bags_list.list.ListError
  }
  /** A error in the list interface implementation. */
  export function List(
    value: t.pallet_bags_list.pallet.Error.List["value"],
  ): t.pallet_bags_list.pallet.Error.List {
    return { type: "List", value }
  }
}

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_bags_list.pallet.Event.Rebagged
  | t.pallet_bags_list.pallet.Event.ScoreUpdated
export namespace Event {
  /** Moved an account from one bag to another. */
  export interface Rebagged {
    type: "Rebagged"
    who: t.sp_core.crypto.AccountId32
    from: t.u64
    to: t.u64
  }
  /** Updated the score of some account to the given amount. */
  export interface ScoreUpdated {
    type: "ScoreUpdated"
    who: t.sp_core.crypto.AccountId32
    new_score: t.u64
  }
  /** Moved an account from one bag to another. */
  export function Rebagged(
    value: Omit<t.pallet_bags_list.pallet.Event.Rebagged, "type">,
  ): t.pallet_bags_list.pallet.Event.Rebagged {
    return { type: "Rebagged", ...value }
  }
  /** Updated the score of some account to the given amount. */
  export function ScoreUpdated(
    value: Omit<t.pallet_bags_list.pallet.Event.ScoreUpdated, "type">,
  ): t.pallet_bags_list.pallet.Event.ScoreUpdated {
    return { type: "ScoreUpdated", ...value }
  }
}
