import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_fast_unstake.pallet.Call> = _codec.$374

export const $error: $.Codec<t.types.pallet_fast_unstake.pallet.Error> = _codec.$637

export const $event: $.Codec<t.types.pallet_fast_unstake.pallet.Event> = _codec.$93

export const $maxChecking: $.Codec<t.types.pallet_fast_unstake.pallet.MaxChecking> = _codec.$635

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_fast_unstake.pallet.Call.register_fast_unstake
  | t.types.pallet_fast_unstake.pallet.Call.deregister
  | t.types.pallet_fast_unstake.pallet.Call.control
export namespace Call {
  /**
   * Register oneself for fast-unstake.
   *
   * The dispatch origin of this call must be signed by the controller account, similar to
   * `staking::unbond`.
   *
   * The stash associated with the origin must have no ongoing unlocking chunks. If
   * successful, this will fully unbond and chill the stash. Then, it will enqueue the stash
   * to be checked in further blocks.
   *
   * If by the time this is called, the stash is actually eligible for fast-unstake, then
   * they are guaranteed to remain eligible, because the call will chill them as well.
   *
   * If the check works, the entire staking data is removed, i.e. the stash is fully
   * unstaked.
   *
   * If the check fails, the stash remains chilled and waiting for being unbonded as in with
   * the normal staking system, but they lose part of their unbonding chunks due to consuming
   * the chain's resources.
   */
  export interface register_fast_unstake {
    type: "register_fast_unstake"
  }
  /**
   * Deregister oneself from the fast-unstake.
   *
   * This is useful if one is registered, they are still waiting, and they change their mind.
   *
   * Note that the associated stash is still fully unbonded and chilled as a consequence of
   * calling `register_fast_unstake`. This should probably be followed by a call to
   * `Staking::rebond`.
   */
  export interface deregister {
    type: "deregister"
  }
  /**
   * Control the operation of this pallet.
   *
   * Dispatch origin must be signed by the [`Config::ControlOrigin`].
   */
  export interface control {
    type: "control"
    unchecked_eras_to_check: t.types.u32
  }
  /**
   * Register oneself for fast-unstake.
   *
   * The dispatch origin of this call must be signed by the controller account, similar to
   * `staking::unbond`.
   *
   * The stash associated with the origin must have no ongoing unlocking chunks. If
   * successful, this will fully unbond and chill the stash. Then, it will enqueue the stash
   * to be checked in further blocks.
   *
   * If by the time this is called, the stash is actually eligible for fast-unstake, then
   * they are guaranteed to remain eligible, because the call will chill them as well.
   *
   * If the check works, the entire staking data is removed, i.e. the stash is fully
   * unstaked.
   *
   * If the check fails, the stash remains chilled and waiting for being unbonded as in with
   * the normal staking system, but they lose part of their unbonding chunks due to consuming
   * the chain's resources.
   */
  export function register_fast_unstake(): t.types.pallet_fast_unstake.pallet.Call.register_fast_unstake {
    return { type: "register_fast_unstake" }
  }
  /**
   * Deregister oneself from the fast-unstake.
   *
   * This is useful if one is registered, they are still waiting, and they change their mind.
   *
   * Note that the associated stash is still fully unbonded and chilled as a consequence of
   * calling `register_fast_unstake`. This should probably be followed by a call to
   * `Staking::rebond`.
   */
  export function deregister(): t.types.pallet_fast_unstake.pallet.Call.deregister {
    return { type: "deregister" }
  }
  /**
   * Control the operation of this pallet.
   *
   * Dispatch origin must be signed by the [`Config::ControlOrigin`].
   */
  export function control(
    value: Omit<t.types.pallet_fast_unstake.pallet.Call.control, "type">,
  ): t.types.pallet_fast_unstake.pallet.Call.control {
    return { type: "control", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "NotController"
  | "AlreadyQueued"
  | "NotFullyBonded"
  | "NotQueued"
  | "AlreadyHead"
  | "CallNotAllowed"

/** The events of this pallet. */
export type Event =
  | t.types.pallet_fast_unstake.pallet.Event.Unstaked
  | t.types.pallet_fast_unstake.pallet.Event.Slashed
  | t.types.pallet_fast_unstake.pallet.Event.Checking
  | t.types.pallet_fast_unstake.pallet.Event.Errored
  | t.types.pallet_fast_unstake.pallet.Event.InternalError
export namespace Event {
  /** A staker was unstaked. */
  export interface Unstaked {
    type: "Unstaked"
    stash: t.types.sp_core.crypto.AccountId32
    result: null | C.ChainError<t.types.sp_runtime.DispatchError>
  }
  /** A staker was slashed for requesting fast-unstake whilst being exposed. */
  export interface Slashed {
    type: "Slashed"
    stash: t.types.sp_core.crypto.AccountId32
    amount: t.types.u128
  }
  /** A staker was partially checked for the given eras, but the process did not finish. */
  export interface Checking {
    type: "Checking"
    stash: t.types.sp_core.crypto.AccountId32
    eras: Array<t.types.u32>
  }
  /**
   * Some internal error happened while migrating stash. They are removed as head as a
   * consequence.
   */
  export interface Errored {
    type: "Errored"
    stash: t.types.sp_core.crypto.AccountId32
  }
  /** An internal error happened. Operations will be paused now. */
  export interface InternalError {
    type: "InternalError"
  }
  /** A staker was unstaked. */
  export function Unstaked(
    value: Omit<t.types.pallet_fast_unstake.pallet.Event.Unstaked, "type">,
  ): t.types.pallet_fast_unstake.pallet.Event.Unstaked {
    return { type: "Unstaked", ...value }
  }
  /** A staker was slashed for requesting fast-unstake whilst being exposed. */
  export function Slashed(
    value: Omit<t.types.pallet_fast_unstake.pallet.Event.Slashed, "type">,
  ): t.types.pallet_fast_unstake.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
  /** A staker was partially checked for the given eras, but the process did not finish. */
  export function Checking(
    value: Omit<t.types.pallet_fast_unstake.pallet.Event.Checking, "type">,
  ): t.types.pallet_fast_unstake.pallet.Event.Checking {
    return { type: "Checking", ...value }
  }
  /**
   * Some internal error happened while migrating stash. They are removed as head as a
   * consequence.
   */
  export function Errored(
    value: Omit<t.types.pallet_fast_unstake.pallet.Event.Errored, "type">,
  ): t.types.pallet_fast_unstake.pallet.Event.Errored {
    return { type: "Errored", ...value }
  }
  /** An internal error happened. Operations will be paused now. */
  export function InternalError(): t.types.pallet_fast_unstake.pallet.Event.InternalError {
    return { type: "InternalError" }
  }
}

export function MaxChecking() {
  return null
}

export type MaxChecking = null
