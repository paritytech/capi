import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Pending swap operations. */
export const PendingSwap = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Registrar",
  "PendingSwap",
  $.tuple(codecs.$98),
  codecs.$98,
)

/**
 *  Amount held on deposit for each para and the original depositor.
 *
 *  The given account ID is responsible for registering the code and initial head data, but may only do
 *  so if it isn't yet registered. (After that, it's up to governance to do so.)
 */
export const Paras = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Registrar",
  "Paras",
  $.tuple(codecs.$98),
  codecs.$701,
)

/** The next free `ParaId`. */
export const NextFreeParaId = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Registrar",
  "NextFreeParaId",
  $.tuple(),
  codecs.$98,
)

/**
 * Register head data and validation code for a reserved Para Id.
 *
 * ## Arguments
 * - `origin`: Must be called by a `Signed` origin.
 * - `id`: The para ID. Must be owned/managed by the `origin` signing account.
 * - `genesis_head`: The genesis head data of the parachain/thread.
 * - `validation_code`: The initial validation code of the parachain/thread.
 *
 * ## Deposits/Fees
 * The origin signed account must reserve a corresponding deposit for the registration. Anything already
 * reserved previously for this para ID is accounted for.
 *
 * ## Events
 * The `Registered` event is emitted in case of success.
 */
export function register(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.register, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "register" } }
}

/**
 * Force the registration of a Para Id on the relay chain.
 *
 * This function must be called by a Root origin.
 *
 * The deposit taken can be specified for this registration. Any `ParaId`
 * can be registered, including sub-1000 IDs which are System Parachains.
 */
export function force_register(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.force_register, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "force_register" } }
}

/**
 * Deregister a Para Id, freeing all data and returning any deposit.
 *
 * The caller must be Root, the `para` owner, or the `para` itself. The para must be a parathread.
 */
export function deregister(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.deregister, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "deregister" } }
}

/**
 * Swap a parachain with another parachain or parathread.
 *
 * The origin must be Root, the `para` owner, or the `para` itself.
 *
 * The swap will happen only if there is already an opposite swap pending. If there is not,
 * the swap will be stored in the pending swaps map, ready for a later confirmatory swap.
 *
 * The `ParaId`s remain mapped to the same head data and code so external code can rely on
 * `ParaId` to be a long-term identifier of a notional "parachain". However, their
 * scheduling info (i.e. whether they're a parathread or parachain), auction information
 * and the auction deposit are switched.
 */
export function swap(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.swap, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "swap" } }
}

/**
 * Remove a manager lock from a para. This will allow the manager of a
 * previously locked para to deregister or swap a para without using governance.
 *
 * Can only be called by the Root origin or the parachain.
 */
export function remove_lock(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.remove_lock, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "remove_lock" } }
}

/**
 * Reserve a Para Id on the relay chain.
 *
 * This function will reserve a new Para Id to be owned/managed by the origin account.
 * The origin account is able to register head data and validation code using `register` to create
 * a parathread. Using the Slots pallet, a parathread can then be upgraded to get a parachain slot.
 *
 * ## Arguments
 * - `origin`: Must be called by a `Signed` origin. Becomes the manager/owner of the new para ID.
 *
 * ## Deposits/Fees
 * The origin must reserve a deposit of `ParaDeposit` for the registration.
 *
 * ## Events
 * The `Reserved` event is emitted in case of success, which provides the ID reserved for use.
 */
export function reserve(): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { type: "reserve" } }
}

/**
 * Add a manager lock from a para. This will prevent the manager of a
 * para to deregister or swap a para.
 *
 * Can be called by Root, the parachain, or the parachain manager if the parachain is unlocked.
 */
export function add_lock(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.add_lock, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "add_lock" } }
}

/**
 * Schedule a parachain upgrade.
 *
 * Can be called by Root, the parachain, or the parachain manager if the parachain is unlocked.
 */
export function schedule_code_upgrade(
  value: Omit<
    types.polkadot_runtime_common.paras_registrar.pallet.Call.schedule_code_upgrade,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "schedule_code_upgrade" } }
}

/**
 * Set the parachain's current head.
 *
 * Can be called by Root, the parachain, or the parachain manager if the parachain is unlocked.
 */
export function set_current_head(
  value: Omit<types.polkadot_runtime_common.paras_registrar.pallet.Call.set_current_head, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Registrar", value: { ...value, type: "set_current_head" } }
}
