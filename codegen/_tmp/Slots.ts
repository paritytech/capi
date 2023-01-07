import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
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
export const Leases = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Slots",
  "Leases",
  $.tuple(codecs.$97),
  codecs.$695,
)

/**
 * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
 * independently of any other on-chain mechanism to use it.
 *
 * The dispatch origin for this call must match `T::ForceOrigin`.
 */
export function forceLease(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.forceLease, "type">,
) {
  return { type: "Slots", value: { ...value, type: "forceLease" } }
}

/**
 * Clear all leases for a Para Id, refunding any deposits back to the original owners.
 *
 * The dispatch origin for this call must match `T::ForceOrigin`.
 */
export function clearAllLeases(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.clearAllLeases, "type">,
) {
  return { type: "Slots", value: { ...value, type: "clearAllLeases" } }
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
export function triggerOnboard(
  value: Omit<types.polkadot_runtime_common.slots.pallet.Call.triggerOnboard, "type">,
) {
  return { type: "Slots", value: { ...value, type: "triggerOnboard" } }
}

/** The number of blocks over which a single period lasts. */
export const LeasePeriod: types.u32 = codecs.$4.decode(C.hex.decode("00751200" as C.Hex))

/** The number of blocks to offset each lease period by. */
export const LeaseOffset: types.u32 = codecs.$4.decode(C.hex.decode("00100e00" as C.Hex))
