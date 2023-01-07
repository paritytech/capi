import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export const $call: $.Codec<types.polkadot_runtime_common.slots.pallet.Call> = codecs.$411
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_common.slots.pallet.Call.forceLease
  | types.polkadot_runtime_common.slots.pallet.Call.clearAllLeases
  | types.polkadot_runtime_common.slots.pallet.Call.triggerOnboard
export namespace Call {
  /**
   * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
   * independently of any other on-chain mechanism to use it.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export interface forceLease {
    type: "forceLease"
    para: types.polkadot_parachain.primitives.Id
    leaser: types.sp_core.crypto.AccountId32
    amount: types.u128
    periodBegin: types.u32
    periodCount: types.u32
  }
  /**
   * Clear all leases for a Para Id, refunding any deposits back to the original owners.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export interface clearAllLeases {
    type: "clearAllLeases"
    para: types.polkadot_parachain.primitives.Id
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
  export interface triggerOnboard {
    type: "triggerOnboard"
    para: types.polkadot_parachain.primitives.Id
  }
  /**
   * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
   * independently of any other on-chain mechanism to use it.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export function forceLease(
    value: Omit<types.polkadot_runtime_common.slots.pallet.Call.forceLease, "type">,
  ): types.polkadot_runtime_common.slots.pallet.Call.forceLease {
    return { type: "forceLease", ...value }
  }
  /**
   * Clear all leases for a Para Id, refunding any deposits back to the original owners.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export function clearAllLeases(
    value: Omit<types.polkadot_runtime_common.slots.pallet.Call.clearAllLeases, "type">,
  ): types.polkadot_runtime_common.slots.pallet.Call.clearAllLeases {
    return { type: "clearAllLeases", ...value }
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
  ): types.polkadot_runtime_common.slots.pallet.Call.triggerOnboard {
    return { type: "triggerOnboard", ...value }
  }
}

export const $error: $.Codec<types.polkadot_runtime_common.slots.pallet.Error> = codecs.$696
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error = "ParaNotOnboarding" | "LeaseError"

export const $event: $.Codec<types.polkadot_runtime_common.slots.pallet.Event> = codecs.$117
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod
  | types.polkadot_runtime_common.slots.pallet.Event.Leased
export namespace Event {
  /** A new `[lease_period]` is beginning. */
  export interface NewLeasePeriod {
    type: "NewLeasePeriod"
    leasePeriod: types.u32
  }
  /**
   * A para has won the right to a continuous set of lease periods as a parachain.
   * First balance is any extra amount reserved on top of the para's existing deposit.
   * Second balance is the total amount reserved.
   */
  export interface Leased {
    type: "Leased"
    paraId: types.polkadot_parachain.primitives.Id
    leaser: types.sp_core.crypto.AccountId32
    periodBegin: types.u32
    periodCount: types.u32
    extraReserved: types.u128
    totalAmount: types.u128
  }
  /** A new `[lease_period]` is beginning. */
  export function NewLeasePeriod(
    value: Omit<types.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod, "type">,
  ): types.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod {
    return { type: "NewLeasePeriod", ...value }
  }
  /**
   * A para has won the right to a continuous set of lease periods as a parachain.
   * First balance is any extra amount reserved on top of the para's existing deposit.
   * Second balance is the total amount reserved.
   */
  export function Leased(
    value: Omit<types.polkadot_runtime_common.slots.pallet.Event.Leased, "type">,
  ): types.polkadot_runtime_common.slots.pallet.Event.Leased {
    return { type: "Leased", ...value }
  }
}
