import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_fast_unstake.pallet.Call.register_fast_unstake
  | types.pallet_fast_unstake.pallet.Call.deregister
  | types.pallet_fast_unstake.pallet.Call.control
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
    unchecked_eras_to_check: types.u32
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
  export function register_fast_unstake(): types.pallet_fast_unstake.pallet.Call.register_fast_unstake {
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
  export function deregister(): types.pallet_fast_unstake.pallet.Call.deregister {
    return { type: "deregister" }
  }
  /**
   * Control the operation of this pallet.
   *
   * Dispatch origin must be signed by the [`Config::ControlOrigin`].
   */
  export function control(
    value: Omit<types.pallet_fast_unstake.pallet.Call.control, "type">,
  ): types.pallet_fast_unstake.pallet.Call.control {
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
  | types.pallet_fast_unstake.pallet.Event.Unstaked
  | types.pallet_fast_unstake.pallet.Event.Slashed
  | types.pallet_fast_unstake.pallet.Event.Checking
  | types.pallet_fast_unstake.pallet.Event.Errored
  | types.pallet_fast_unstake.pallet.Event.InternalError
export namespace Event {
  /** A staker was unstaked. */
  export interface Unstaked {
    type: "Unstaked"
    stash: types.sp_core.crypto.AccountId32
    result: null | C.ChainError<types.sp_runtime.DispatchError>
  }
  /** A staker was slashed for requesting fast-unstake whilst being exposed. */
  export interface Slashed {
    type: "Slashed"
    stash: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** A staker was partially checked for the given eras, but the process did not finish. */
  export interface Checking {
    type: "Checking"
    stash: types.sp_core.crypto.AccountId32
    eras: Array<types.u32>
  }
  /**
   * Some internal error happened while migrating stash. They are removed as head as a
   * consequence.
   */
  export interface Errored {
    type: "Errored"
    stash: types.sp_core.crypto.AccountId32
  }
  /** An internal error happened. Operations will be paused now. */
  export interface InternalError {
    type: "InternalError"
  }
  /** A staker was unstaked. */
  export function Unstaked(
    value: Omit<types.pallet_fast_unstake.pallet.Event.Unstaked, "type">,
  ): types.pallet_fast_unstake.pallet.Event.Unstaked {
    return { type: "Unstaked", ...value }
  }
  /** A staker was slashed for requesting fast-unstake whilst being exposed. */
  export function Slashed(
    value: Omit<types.pallet_fast_unstake.pallet.Event.Slashed, "type">,
  ): types.pallet_fast_unstake.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
  /** A staker was partially checked for the given eras, but the process did not finish. */
  export function Checking(
    value: Omit<types.pallet_fast_unstake.pallet.Event.Checking, "type">,
  ): types.pallet_fast_unstake.pallet.Event.Checking {
    return { type: "Checking", ...value }
  }
  /**
   * Some internal error happened while migrating stash. They are removed as head as a
   * consequence.
   */
  export function Errored(
    value: Omit<types.pallet_fast_unstake.pallet.Event.Errored, "type">,
  ): types.pallet_fast_unstake.pallet.Event.Errored {
    return { type: "Errored", ...value }
  }
  /** An internal error happened. Operations will be paused now. */
  export function InternalError(): types.pallet_fast_unstake.pallet.Event.InternalError {
    return { type: "InternalError" }
  }
}

export type MaxChecking = null

export function MaxChecking() {
  return null
}
