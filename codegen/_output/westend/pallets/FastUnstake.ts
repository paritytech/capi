import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/** Counter for the related counted storage map */
export const CounterForQueue = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 *  Number of eras to check per block.
 *
 *  If set to 0, this pallet does absolutely nothing.
 *
 *  Based on the amount of weight available at `on_idle`, up to this many eras of a single
 *  nominator might be checked.
 */
export const ErasToCheckPerBlock = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** The current "head of the queue" being unstaked. */
export const Head = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$634,
}

/**
 *  The map of all accounts wishing to be unstaked.
 *
 *  Keeps track of `AccountId` wishing to unstake and it's corresponding deposit.
 */
export const Queue = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$6,
}

/**
 * Control the operation of this pallet.
 *
 * Dispatch origin must be signed by the [`Config::ControlOrigin`].
 */
export function control(
  value: Omit<t.pallet_fast_unstake.pallet.Call.control, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "FastUnstake", value: { ...value, type: "control" } }
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
export function deregister(): t.polkadot_runtime.RuntimeCall {
  return { type: "FastUnstake", value: { type: "deregister" } }
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
export function register_fast_unstake(): t.polkadot_runtime.RuntimeCall {
  return { type: "FastUnstake", value: { type: "register_fast_unstake" } }
}
