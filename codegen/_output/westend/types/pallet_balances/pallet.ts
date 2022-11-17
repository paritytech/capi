import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_balances.pallet.Call.transfer
  | types.pallet_balances.pallet.Call.setBalance
  | types.pallet_balances.pallet.Call.forceTransfer
  | types.pallet_balances.pallet.Call.transferKeepAlive
  | types.pallet_balances.pallet.Call.transferAll
  | types.pallet_balances.pallet.Call.forceUnreserve
export namespace Call {
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
  export interface transfer {
    type: "transfer"
    dest: types.sp_runtime.multiaddress.MultiAddress
    value: types.Compact<types.u128>
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
  export interface setBalance {
    type: "setBalance"
    who: types.sp_runtime.multiaddress.MultiAddress
    newFree: types.Compact<types.u128>
    newReserved: types.Compact<types.u128>
  }
  /**
   * Exactly as `transfer`, except the origin must be root and the source account may be
   * specified.
   * # <weight>
   * - Same as transfer, but additional read and write because the source account is not
   *   assumed to be in the overlay.
   * # </weight>
   */
  export interface forceTransfer {
    type: "forceTransfer"
    source: types.sp_runtime.multiaddress.MultiAddress
    dest: types.sp_runtime.multiaddress.MultiAddress
    value: types.Compact<types.u128>
  }
  /**
   * Same as the [`transfer`] call, but with a check that the transfer will not kill the
   * origin account.
   *
   * 99% of the time you want [`transfer`] instead.
   *
   * [`transfer`]: struct.Pallet.html#method.transfer
   */
  export interface transferKeepAlive {
    type: "transferKeepAlive"
    dest: types.sp_runtime.multiaddress.MultiAddress
    value: types.Compact<types.u128>
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
  export interface transferAll {
    type: "transferAll"
    dest: types.sp_runtime.multiaddress.MultiAddress
    keepAlive: boolean
  }
  /**
   * Unreserve some balance from a user by force.
   *
   * Can only be called by ROOT.
   */
  export interface forceUnreserve {
    type: "forceUnreserve"
    who: types.sp_runtime.multiaddress.MultiAddress
    amount: types.u128
  }
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
  ): types.pallet_balances.pallet.Call.transfer {
    return { type: "transfer", ...value }
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
  export function setBalance(
    value: Omit<types.pallet_balances.pallet.Call.setBalance, "type">,
  ): types.pallet_balances.pallet.Call.setBalance {
    return { type: "setBalance", ...value }
  }
  /**
   * Exactly as `transfer`, except the origin must be root and the source account may be
   * specified.
   * # <weight>
   * - Same as transfer, but additional read and write because the source account is not
   *   assumed to be in the overlay.
   * # </weight>
   */
  export function forceTransfer(
    value: Omit<types.pallet_balances.pallet.Call.forceTransfer, "type">,
  ): types.pallet_balances.pallet.Call.forceTransfer {
    return { type: "forceTransfer", ...value }
  }
  /**
   * Same as the [`transfer`] call, but with a check that the transfer will not kill the
   * origin account.
   *
   * 99% of the time you want [`transfer`] instead.
   *
   * [`transfer`]: struct.Pallet.html#method.transfer
   */
  export function transferKeepAlive(
    value: Omit<types.pallet_balances.pallet.Call.transferKeepAlive, "type">,
  ): types.pallet_balances.pallet.Call.transferKeepAlive {
    return { type: "transferKeepAlive", ...value }
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
  export function transferAll(
    value: Omit<types.pallet_balances.pallet.Call.transferAll, "type">,
  ): types.pallet_balances.pallet.Call.transferAll {
    return { type: "transferAll", ...value }
  }
  /**
   * Unreserve some balance from a user by force.
   *
   * Can only be called by ROOT.
   */
  export function forceUnreserve(
    value: Omit<types.pallet_balances.pallet.Call.forceUnreserve, "type">,
  ): types.pallet_balances.pallet.Call.forceUnreserve {
    return { type: "forceUnreserve", ...value }
  }
}
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "VestingBalance"
  | "LiquidityRestrictions"
  | "InsufficientBalance"
  | "ExistentialDeposit"
  | "KeepAlive"
  | "ExistingVestingSchedule"
  | "DeadAccount"
  | "TooManyReserves"
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_balances.pallet.Event.Endowed
  | types.pallet_balances.pallet.Event.DustLost
  | types.pallet_balances.pallet.Event.Transfer
  | types.pallet_balances.pallet.Event.BalanceSet
  | types.pallet_balances.pallet.Event.Reserved
  | types.pallet_balances.pallet.Event.Unreserved
  | types.pallet_balances.pallet.Event.ReserveRepatriated
  | types.pallet_balances.pallet.Event.Deposit
  | types.pallet_balances.pallet.Event.Withdraw
  | types.pallet_balances.pallet.Event.Slashed
export namespace Event {
  /** An account was created with some free balance. */
  export interface Endowed {
    type: "Endowed"
    account: types.sp_core.crypto.AccountId32
    freeBalance: types.u128
  }
  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  export interface DustLost {
    type: "DustLost"
    account: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** Transfer succeeded. */
  export interface Transfer {
    type: "Transfer"
    from: types.sp_core.crypto.AccountId32
    to: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** A balance was set by root. */
  export interface BalanceSet {
    type: "BalanceSet"
    who: types.sp_core.crypto.AccountId32
    free: types.u128
    reserved: types.u128
  }
  /** Some balance was reserved (moved from free to reserved). */
  export interface Reserved {
    type: "Reserved"
    who: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** Some balance was unreserved (moved from reserved to free). */
  export interface Unreserved {
    type: "Unreserved"
    who: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  export interface ReserveRepatriated {
    type: "ReserveRepatriated"
    from: types.sp_core.crypto.AccountId32
    to: types.sp_core.crypto.AccountId32
    amount: types.u128
    destinationStatus: types.frame_support.traits.tokens.misc.BalanceStatus
  }
  /** Some amount was deposited (e.g. for transaction fees). */
  export interface Deposit {
    type: "Deposit"
    who: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** Some amount was withdrawn from the account (e.g. for transaction fees). */
  export interface Withdraw {
    type: "Withdraw"
    who: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** Some amount was removed from the account (e.g. for misbehavior). */
  export interface Slashed {
    type: "Slashed"
    who: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** An account was created with some free balance. */
  export function Endowed(
    value: Omit<types.pallet_balances.pallet.Event.Endowed, "type">,
  ): types.pallet_balances.pallet.Event.Endowed {
    return { type: "Endowed", ...value }
  }
  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  export function DustLost(
    value: Omit<types.pallet_balances.pallet.Event.DustLost, "type">,
  ): types.pallet_balances.pallet.Event.DustLost {
    return { type: "DustLost", ...value }
  }
  /** Transfer succeeded. */
  export function Transfer(
    value: Omit<types.pallet_balances.pallet.Event.Transfer, "type">,
  ): types.pallet_balances.pallet.Event.Transfer {
    return { type: "Transfer", ...value }
  }
  /** A balance was set by root. */
  export function BalanceSet(
    value: Omit<types.pallet_balances.pallet.Event.BalanceSet, "type">,
  ): types.pallet_balances.pallet.Event.BalanceSet {
    return { type: "BalanceSet", ...value }
  }
  /** Some balance was reserved (moved from free to reserved). */
  export function Reserved(
    value: Omit<types.pallet_balances.pallet.Event.Reserved, "type">,
  ): types.pallet_balances.pallet.Event.Reserved {
    return { type: "Reserved", ...value }
  }
  /** Some balance was unreserved (moved from reserved to free). */
  export function Unreserved(
    value: Omit<types.pallet_balances.pallet.Event.Unreserved, "type">,
  ): types.pallet_balances.pallet.Event.Unreserved {
    return { type: "Unreserved", ...value }
  }
  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  export function ReserveRepatriated(
    value: Omit<types.pallet_balances.pallet.Event.ReserveRepatriated, "type">,
  ): types.pallet_balances.pallet.Event.ReserveRepatriated {
    return { type: "ReserveRepatriated", ...value }
  }
  /** Some amount was deposited (e.g. for transaction fees). */
  export function Deposit(
    value: Omit<types.pallet_balances.pallet.Event.Deposit, "type">,
  ): types.pallet_balances.pallet.Event.Deposit {
    return { type: "Deposit", ...value }
  }
  /** Some amount was withdrawn from the account (e.g. for transaction fees). */
  export function Withdraw(
    value: Omit<types.pallet_balances.pallet.Event.Withdraw, "type">,
  ): types.pallet_balances.pallet.Event.Withdraw {
    return { type: "Withdraw", ...value }
  }
  /** Some amount was removed from the account (e.g. for misbehavior). */
  export function Slashed(
    value: Omit<types.pallet_balances.pallet.Event.Slashed, "type">,
  ): types.pallet_balances.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
}
