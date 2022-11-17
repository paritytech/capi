import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The current membership, stored as an ordered Vec. */
export const Members = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TechnicalMembership",
  "Members",
  $.tuple(),
  codecs.$554,
)

/** The current prime member, if one exists. */
export const Prime = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "TechnicalMembership",
  "Prime",
  $.tuple(),
  codecs.$0,
)

/**
 * Add a member `who` to the set.
 *
 * May only be called from `T::AddOrigin`.
 */
export function addMember(
  value: Omit<types.pallet_membership.pallet.Call.addMember, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "addMember" } }
}

/**
 * Remove a member `who` from the set.
 *
 * May only be called from `T::RemoveOrigin`.
 */
export function removeMember(
  value: Omit<types.pallet_membership.pallet.Call.removeMember, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "removeMember" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "swapMember" } }
}

/**
 * Change the membership to a new set, disregarding the existing membership. Be nice and
 * pass `members` pre-sorted.
 *
 * May only be called from `T::ResetOrigin`.
 */
export function resetMembers(
  value: Omit<types.pallet_membership.pallet.Call.resetMembers, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "resetMembers" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "changeKey" } }
}

/**
 * Set the prime member. Must be a current member.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function setPrime(
  value: Omit<types.pallet_membership.pallet.Call.setPrime, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "setPrime" } }
}

/**
 * Remove the prime member if it exists.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function clearPrime(): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { type: "clearPrime" } }
}
