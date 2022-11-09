import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $call: $.Codec<t.polkadot_runtime_common.slots.pallet.Call> = _codec.$412

export const $error: $.Codec<t.polkadot_runtime_common.slots.pallet.Error> = _codec.$704

export const $event: $.Codec<t.polkadot_runtime_common.slots.pallet.Event> = _codec.$118

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.polkadot_runtime_common.slots.pallet.Call.force_lease
  | t.polkadot_runtime_common.slots.pallet.Call.clear_all_leases
  | t.polkadot_runtime_common.slots.pallet.Call.trigger_onboard
export namespace Call {
  /**
   * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
   * independently of any other on-chain mechanism to use it.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export interface force_lease {
    type: "force_lease"
    para: t.polkadot_parachain.primitives.Id
    leaser: t.sp_core.crypto.AccountId32
    amount: t.u128
    period_begin: t.u32
    period_count: t.u32
  }
  /**
   * Clear all leases for a Para Id, refunding any deposits back to the original owners.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export interface clear_all_leases {
    type: "clear_all_leases"
    para: t.polkadot_parachain.primitives.Id
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
  export interface trigger_onboard {
    type: "trigger_onboard"
    para: t.polkadot_parachain.primitives.Id
  }
  /**
   * Just a connect into the `lease_out` call, in case Root wants to force some lease to happen
   * independently of any other on-chain mechanism to use it.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export function force_lease(
    value: Omit<t.polkadot_runtime_common.slots.pallet.Call.force_lease, "type">,
  ): t.polkadot_runtime_common.slots.pallet.Call.force_lease {
    return { type: "force_lease", ...value }
  }
  /**
   * Clear all leases for a Para Id, refunding any deposits back to the original owners.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   */
  export function clear_all_leases(
    value: Omit<t.polkadot_runtime_common.slots.pallet.Call.clear_all_leases, "type">,
  ): t.polkadot_runtime_common.slots.pallet.Call.clear_all_leases {
    return { type: "clear_all_leases", ...value }
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
    value: Omit<t.polkadot_runtime_common.slots.pallet.Call.trigger_onboard, "type">,
  ): t.polkadot_runtime_common.slots.pallet.Call.trigger_onboard {
    return { type: "trigger_onboard", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error = "ParaNotOnboarding" | "LeaseError"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod
  | t.polkadot_runtime_common.slots.pallet.Event.Leased
export namespace Event {
  /** A new `[lease_period]` is beginning. */
  export interface NewLeasePeriod {
    type: "NewLeasePeriod"
    lease_period: t.u32
  }
  /**
   * A para has won the right to a continuous set of lease periods as a parachain.
   * First balance is any extra amount reserved on top of the para's existing deposit.
   * Second balance is the total amount reserved.
   */
  export interface Leased {
    type: "Leased"
    para_id: t.polkadot_parachain.primitives.Id
    leaser: t.sp_core.crypto.AccountId32
    period_begin: t.u32
    period_count: t.u32
    extra_reserved: t.u128
    total_amount: t.u128
  }
  /** A new `[lease_period]` is beginning. */
  export function NewLeasePeriod(
    value: Omit<t.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod, "type">,
  ): t.polkadot_runtime_common.slots.pallet.Event.NewLeasePeriod {
    return { type: "NewLeasePeriod", ...value }
  }
  /**
   * A para has won the right to a continuous set of lease periods as a parachain.
   * First balance is any extra amount reserved on top of the para's existing deposit.
   * Second balance is the total amount reserved.
   */
  export function Leased(
    value: Omit<t.polkadot_runtime_common.slots.pallet.Event.Leased, "type">,
  ): t.polkadot_runtime_common.slots.pallet.Event.Leased {
    return { type: "Leased", ...value }
  }
}
