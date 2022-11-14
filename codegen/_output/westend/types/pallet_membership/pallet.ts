import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_membership.pallet.Call.add_member
  | types.pallet_membership.pallet.Call.remove_member
  | types.pallet_membership.pallet.Call.swap_member
  | types.pallet_membership.pallet.Call.reset_members
  | types.pallet_membership.pallet.Call.change_key
  | types.pallet_membership.pallet.Call.set_prime
  | types.pallet_membership.pallet.Call.clear_prime
export namespace Call {
  /**
   * Add a member `who` to the set.
   *
   * May only be called from `T::AddOrigin`.
   */
  export interface add_member {
    type: "add_member"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove a member `who` from the set.
   *
   * May only be called from `T::RemoveOrigin`.
   */
  export interface remove_member {
    type: "remove_member"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Swap out one member `remove` for another `add`.
   *
   * May only be called from `T::SwapOrigin`.
   *
   * Prime membership is *not* passed from `remove` to `add`, if extant.
   */
  export interface swap_member {
    type: "swap_member"
    remove: types.sp_runtime.multiaddress.MultiAddress
    add: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Change the membership to a new set, disregarding the existing membership. Be nice and
   * pass `members` pre-sorted.
   *
   * May only be called from `T::ResetOrigin`.
   */
  export interface reset_members {
    type: "reset_members"
    members: Array<types.sp_core.crypto.AccountId32>
  }
  /**
   * Swap out the sending member for some other key `new`.
   *
   * May only be called from `Signed` origin of a current member.
   *
   * Prime membership is passed from the origin account to `new`, if extant.
   */
  export interface change_key {
    type: "change_key"
    new: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Set the prime member. Must be a current member.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export interface set_prime {
    type: "set_prime"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove the prime member if it exists.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export interface clear_prime {
    type: "clear_prime"
  }
  /**
   * Add a member `who` to the set.
   *
   * May only be called from `T::AddOrigin`.
   */
  export function add_member(
    value: Omit<types.pallet_membership.pallet.Call.add_member, "type">,
  ): types.pallet_membership.pallet.Call.add_member {
    return { type: "add_member", ...value }
  }
  /**
   * Remove a member `who` from the set.
   *
   * May only be called from `T::RemoveOrigin`.
   */
  export function remove_member(
    value: Omit<types.pallet_membership.pallet.Call.remove_member, "type">,
  ): types.pallet_membership.pallet.Call.remove_member {
    return { type: "remove_member", ...value }
  }
  /**
   * Swap out one member `remove` for another `add`.
   *
   * May only be called from `T::SwapOrigin`.
   *
   * Prime membership is *not* passed from `remove` to `add`, if extant.
   */
  export function swap_member(
    value: Omit<types.pallet_membership.pallet.Call.swap_member, "type">,
  ): types.pallet_membership.pallet.Call.swap_member {
    return { type: "swap_member", ...value }
  }
  /**
   * Change the membership to a new set, disregarding the existing membership. Be nice and
   * pass `members` pre-sorted.
   *
   * May only be called from `T::ResetOrigin`.
   */
  export function reset_members(
    value: Omit<types.pallet_membership.pallet.Call.reset_members, "type">,
  ): types.pallet_membership.pallet.Call.reset_members {
    return { type: "reset_members", ...value }
  }
  /**
   * Swap out the sending member for some other key `new`.
   *
   * May only be called from `Signed` origin of a current member.
   *
   * Prime membership is passed from the origin account to `new`, if extant.
   */
  export function change_key(
    value: Omit<types.pallet_membership.pallet.Call.change_key, "type">,
  ): types.pallet_membership.pallet.Call.change_key {
    return { type: "change_key", ...value }
  }
  /**
   * Set the prime member. Must be a current member.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export function set_prime(
    value: Omit<types.pallet_membership.pallet.Call.set_prime, "type">,
  ): types.pallet_membership.pallet.Call.set_prime {
    return { type: "set_prime", ...value }
  }
  /**
   * Remove the prime member if it exists.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export function clear_prime(): types.pallet_membership.pallet.Call.clear_prime {
    return { type: "clear_prime" }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error = "AlreadyMember" | "NotMember" | "TooManyMembers"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | "MemberAdded"
  | "MemberRemoved"
  | "MembersSwapped"
  | "MembersReset"
  | "KeyChanged"
  | "Dummy"
