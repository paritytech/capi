import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  Amounts held on deposit for each (possibly future) leased parachain.
 *
 *  The actual amount locked on its behalf by any account at any time is the maximum of the second values
 *  of the items in this list whose first value is the account.
 *
 *  The first item in the list is the amount locked for the current Lease Period. Following
 *  items are for the subsequent lease periods.
 *
 *  The default value (an empty list) implies that the parachain no longer exists (or never
 *  existed) as far as this pallet is concerned.
 *
 *  If a parachain doesn't exist *yet* but is scheduled to exist in the future, then it
 *  will be left-padded with one or more `None`s to denote the fact that nothing is held on
 *  deposit for the non-existent chain currently, but is held at some point in the future.
 *
 *  It is illegal for a `None` value to trail in the list.
 */
export const Leases = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$703,
}

/**
 * Clear all leases for a Para Id, refunding any deposits back to the original owners.
 *
 * The dispatch origin for this call must match `T::ForceOrigin`.
 */
export function clear_all_leases(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.clear_all_leases, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Slots", value: { ...value, type: "clear_all_leases" } }
}

/**
 * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
 * independently of any other on-chain mechanism to use it.
 *
 * The dispatch origin for this call must match `T::ForceOrigin`.
 */
export function force_lease(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.force_lease, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Slots", value: { ...value, type: "force_lease" } }
}

/**
 * Try to onboard a parachain that has a lease for the current lease period.
 *
 * This function can be useful if there was some state issue with a para that should
 * have onboarded, but was unable to. As long as they have a lease period, we can
 * let them onboard from here.
 *
 * Origin must be signed, but can be called by anyone.
 */
export function trigger_onboard(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.trigger_onboard, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Slots", value: { ...value, type: "trigger_onboard" } }
}
