import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** The current membership, stored as an ordered Vec. */
export const Members = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$554,
}

/** The current prime member, if one exists. */
export const Prime = { type: "Plain", modifier: "Optional", hashers: [], key: [], value: _codec.$0 }

/**
 * Add a member `who` to the set.
 *
 * May only be called from `T::AddOrigin`.
 */
export function add_member(
  value: Omit<t.types.pallet_membership.pallet.Call.add_member, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "add_member" } }
}

/**
 * Swap out the sending member for some other key `new`.
 *
 * May only be called from `Signed` origin of a current member.
 *
 * Prime membership is passed from the origin account to `new`, if extant.
 */
export function change_key(
  value: Omit<t.types.pallet_membership.pallet.Call.change_key, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "change_key" } }
}

/**
 * Remove the prime member if it exists.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function clear_prime(): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { type: "clear_prime" } }
}

/**
 * Remove a member `who` from the set.
 *
 * May only be called from `T::RemoveOrigin`.
 */
export function remove_member(
  value: Omit<t.types.pallet_membership.pallet.Call.remove_member, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "remove_member" } }
}

/**
 * Change the membership to a new set, disregarding the existing membership. Be nice and
 * pass `members` pre-sorted.
 *
 * May only be called from `T::ResetOrigin`.
 */
export function reset_members(
  value: Omit<t.types.pallet_membership.pallet.Call.reset_members, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "reset_members" } }
}

/**
 * Set the prime member. Must be a current member.
 *
 * May only be called from `T::PrimeOrigin`.
 */
export function set_prime(
  value: Omit<t.types.pallet_membership.pallet.Call.set_prime, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "set_prime" } }
}

/**
 * Swap out one member `remove` for another `add`.
 *
 * May only be called from `T::SwapOrigin`.
 *
 * Prime membership is *not* passed from `remove` to `add`, if extant.
 */
export function swap_member(
  value: Omit<t.types.pallet_membership.pallet.Call.swap_member, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "TechnicalMembership", value: { ...value, type: "swap_member" } }
}
