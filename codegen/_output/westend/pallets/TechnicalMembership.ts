import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The current membership, stored as an ordered Vec. */
export const Members = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TechnicalMembership",
  "Members",
  $.tuple(),
  _codec.$554,
)

/** The current prime member, if one exists. */
export const Prime = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "TechnicalMembership",
  "Prime",
  $.tuple(),
  _codec.$0,
)

/**
 * Add a member `who` to the set.
 *
 * May only be called from `T::AddOrigin`.
 */
export function add_member(
  value: Omit<types.pallet_membership.pallet.Call.add_member, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "add_member" } }
}

/**
 * Remove a member `who` from the set.
 *
 * May only be called from `T::RemoveOrigin`.
 */
export function remove_member(
  value: Omit<types.pallet_membership.pallet.Call.remove_member, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "remove_member" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "swap_member" } }
}

/**
 * Change the membership to a new set, disregarding the existing membership. Be nice and
 * pass `members` pre-sorted.
 *
 * May only be called from `T::ResetOrigin`.
 */
export function reset_members(
  value: Omit<types.pallet_membership.pallet.Call.reset_members, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "reset_members" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "change_key" } }
}

/**
 * Set the prime member. Must be a current member.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function set_prime(
  value: Omit<types.pallet_membership.pallet.Call.set_prime, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "set_prime" } }
}

/**
 * Remove the prime member if it exists.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function clear_prime(): types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { type: "clear_prime" } }
}
