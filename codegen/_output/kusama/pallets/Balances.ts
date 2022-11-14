import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The total units issued in the system. */
export const TotalIssuance = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Balances",
  "TotalIssuance",
  $.tuple(),
  codecs.$6,
)

/**
 *  The Balances pallet example of storing the balance of an account.
 *
 *  # Example
 *
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
 *   }
 *  ```
 *
 *  You can also store the balance of an account in the `System` pallet.
 *
 *  # Example
 *
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *    type AccountStore = System
 *   }
 *  ```
 *
 *  But this comes with tradeoffs, storing account balances in the system pallet stores
 *  `frame_system` data alongside the account data contrary to storing account balances in the
 *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
 *  NOTE: This is only used in the case that this pallet is used to store balances.
 */
export const Account = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Balances",
  "Account",
  $.tuple(codecs.$0),
  codecs.$5,
)

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 */
export const Locks = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Balances",
  "Locks",
  $.tuple(codecs.$0),
  codecs.$470,
)

/** Named reserves on some account balances. */
export const Reserves = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Balances",
  "Reserves",
  $.tuple(codecs.$0),
  codecs.$474,
)

/**
 *  Storage version of the pallet.
 *
 *  This is set to v2.0.0 for new networks.
 */
export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Balances",
  "StorageVersion",
  $.tuple(),
  codecs.$477,
)

/**
 * Transfer some liquid free balance to another account.
 *
 * `transfer` will set the `FreeBalance` of the sender and receiver.
 * If the sender's account is below the existential deposit as a result
 * of the transfer, the account will be reaped.
 *
 * The dispatch origin for this call must be `Signed` by the transactor.
 *
 * # <weight>
 * - Dependent on arguments but not critical, given proper implementations for input config
 *   types. See related functions below.
 * - It contains a limited number of reads and writes internally and no complex
 *   computation.
 *
 * Related functions:
 *
 *   - `ensure_can_withdraw` is always called internally but has a bounded complexity.
 *   - Transferring balances to accounts that did not exist before will cause
 *     `T::OnNewAccount::on_new_account` to be called.
 *   - Removing enough funds from an account will trigger `T::DustRemoval::on_unbalanced`.
 *   - `transfer_keep_alive` works the same way as `transfer`, but has an additional check
 *     that the transfer will not kill the origin account.
 * ---------------------------------
 * - Origin account is already in memory, so no DB operations for them.
 * # </weight>
 */
export function transfer(
  value: Omit<types.pallet_balances.pallet.Call.transfer, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "transfer" } }
}

/**
 * Set the balances of a given account.
 *
 * This will alter `FreeBalance` and `ReservedBalance` in storage. it will
 * also alter the total issuance of the system (`TotalIssuance`) appropriately.
 * If the new free or reserved balance is below the existential deposit,
 * it will reset the account nonce (`frame_system::AccountNonce`).
 *
 * The dispatch origin for this call is `root`.
 */
export function set_balance(
  value: Omit<types.pallet_balances.pallet.Call.set_balance, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "set_balance" } }
}

/**
 * Exactly as `transfer`, except the origin must be root and the source account may be
 * specified.
 * # <weight>
 * - Same as transfer, but additional read and write because the source account is not
 *   assumed to be in the overlay.
 * # </weight>
 */
export function force_transfer(
  value: Omit<types.pallet_balances.pallet.Call.force_transfer, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "force_transfer" } }
}

/**
 * Same as the [`transfer`] call, but with a check that the transfer will not kill the
 * origin account.
 *
 * 99% of the time you want [`transfer`] instead.
 *
 * [`transfer`]: struct.Pallet.html#method.transfer
 */
export function transfer_keep_alive(
  value: Omit<types.pallet_balances.pallet.Call.transfer_keep_alive, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "transfer_keep_alive" } }
}

/**
 * Transfer the entire transferable balance from the caller account.
 *
 * NOTE: This function only attempts to transfer _transferable_ balances. This means that
 * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
 * transferred by this function. To ensure that this function results in a killed account,
 * you might need to prepare the account by removing any reference counters, storage
 * deposits, etc...
 *
 * The dispatch origin of this call must be Signed.
 *
 * - `dest`: The recipient of the transfer.
 * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
 *   of the funds the account has, causing the sender account to be killed (false), or
 *   transfer everything except at least the existential deposit, which will guarantee to
 *   keep the sender account alive (true). # <weight>
 * - O(1). Just like transfer, but reading the user's transferable balance first.
 *   #</weight>
 */
export function transfer_all(
  value: Omit<types.pallet_balances.pallet.Call.transfer_all, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "transfer_all" } }
}

/**
 * Unreserve some balance from a user by force.
 *
 * Can only be called by ROOT.
 */
export function force_unreserve(
  value: Omit<types.pallet_balances.pallet.Call.force_unreserve, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Balances", value: { ...value, type: "force_unreserve" } }
}
