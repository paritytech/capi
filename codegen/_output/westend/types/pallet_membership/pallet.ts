import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_membership.pallet.Call.addMember
  | types.pallet_membership.pallet.Call.removeMember
  | types.pallet_membership.pallet.Call.swapMember
  | types.pallet_membership.pallet.Call.resetMembers
  | types.pallet_membership.pallet.Call.changeKey
  | types.pallet_membership.pallet.Call.setPrime
  | types.pallet_membership.pallet.Call.clearPrime
export namespace Call {
  /**
   * Add a member `who` to the set.
   *
   * May only be called from `T::AddOrigin`.
   */
  export interface addMember {
    type: "addMember"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove a member `who` from the set.
   *
   * May only be called from `T::RemoveOrigin`.
   */
  export interface removeMember {
    type: "removeMember"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Swap out one member `remove` for another `add`.
   *
   * May only be called from `T::SwapOrigin`.
   *
   * Prime membership is *not* passed from `remove` to `add`, if extant.
   */
  export interface swapMember {
    type: "swapMember"
    remove: types.sp_runtime.multiaddress.MultiAddress
    add: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Change the membership to a new set, disregarding the existing membership. Be nice and
   * pass `members` pre-sorted.
   *
   * May only be called from `T::ResetOrigin`.
   */
  export interface resetMembers {
    type: "resetMembers"
    members: Array<types.sp_core.crypto.AccountId32>
  }
  /**
   * Swap out the sending member for some other key `new`.
   *
   * May only be called from `Signed` origin of a current member.
   *
   * Prime membership is passed from the origin account to `new`, if extant.
   */
  export interface changeKey {
    type: "changeKey"
    new: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Set the prime member. Must be a current member.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export interface setPrime {
    type: "setPrime"
    who: types.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove the prime member if it exists.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export interface clearPrime {
    type: "clearPrime"
  }
  /**
   * Add a member `who` to the set.
   *
   * May only be called from `T::AddOrigin`.
   */
  export function addMember(
    value: Omit<types.pallet_membership.pallet.Call.addMember, "type">,
  ): types.pallet_membership.pallet.Call.addMember {
    return { type: "addMember", ...value }
  }
  /**
   * Remove a member `who` from the set.
   *
   * May only be called from `T::RemoveOrigin`.
   */
  export function removeMember(
    value: Omit<types.pallet_membership.pallet.Call.removeMember, "type">,
  ): types.pallet_membership.pallet.Call.removeMember {
    return { type: "removeMember", ...value }
  }
  /**
   * Swap out one member `remove` for another `add`.
   *
   * May only be called from `T::SwapOrigin`.
   *
   * Prime membership is *not* passed from `remove` to `add`, if extant.
   */
  export function swapMember(
    value: Omit<types.pallet_membership.pallet.Call.swapMember, "type">,
  ): types.pallet_membership.pallet.Call.swapMember {
    return { type: "swapMember", ...value }
  }
  /**
   * Change the membership to a new set, disregarding the existing membership. Be nice and
   * pass `members` pre-sorted.
   *
   * May only be called from `T::ResetOrigin`.
   */
  export function resetMembers(
    value: Omit<types.pallet_membership.pallet.Call.resetMembers, "type">,
  ): types.pallet_membership.pallet.Call.resetMembers {
    return { type: "resetMembers", ...value }
  }
  /**
   * Swap out the sending member for some other key `new`.
   *
   * May only be called from `Signed` origin of a current member.
   *
   * Prime membership is passed from the origin account to `new`, if extant.
   */
  export function changeKey(
    value: Omit<types.pallet_membership.pallet.Call.changeKey, "type">,
  ): types.pallet_membership.pallet.Call.changeKey {
    return { type: "changeKey", ...value }
  }
  /**
   * Set the prime member. Must be a current member.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export function setPrime(
    value: Omit<types.pallet_membership.pallet.Call.setPrime, "type">,
  ): types.pallet_membership.pallet.Call.setPrime {
    return { type: "setPrime", ...value }
  }
  /**
   * Remove the prime member if it exists.
   *
   * May only be called from `T::PrimeOrigin`.
   */
  export function clearPrime(): types.pallet_membership.pallet.Call.clearPrime {
    return { type: "clearPrime" }
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
