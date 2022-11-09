import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_balances.pallet.Call> = _codec.$199

export const $error: $.Codec<t.pallet_balances.pallet.Error> = _codec.$478

export const $event: $.Codec<t.pallet_balances.pallet.Event> = _codec.$36

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.pallet_balances.pallet.Call.transfer
  | t.pallet_balances.pallet.Call.set_balance
  | t.pallet_balances.pallet.Call.force_transfer
  | t.pallet_balances.pallet.Call.transfer_keep_alive
  | t.pallet_balances.pallet.Call.transfer_all
  | t.pallet_balances.pallet.Call.force_unreserve
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
    dest: t.sp_runtime.multiaddress.MultiAddress
    value: t.Compact<t.u128>
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
  export interface set_balance {
    type: "set_balance"
    who: t.sp_runtime.multiaddress.MultiAddress
    new_free: t.Compact<t.u128>
    new_reserved: t.Compact<t.u128>
  }
  /**
   * Exactly as `transfer`, except the origin must be root and the source account may be
   * specified.
   * # <weight>
   * - Same as transfer, but additional read and write because the source account is not
   *   assumed to be in the overlay.
   * # </weight>
   */
  export interface force_transfer {
    type: "force_transfer"
    source: t.sp_runtime.multiaddress.MultiAddress
    dest: t.sp_runtime.multiaddress.MultiAddress
    value: t.Compact<t.u128>
  }
  /**
   * Same as the [`transfer`] call, but with a check that the transfer will not kill the
   * origin account.
   *
   * 99% of the time you want [`transfer`] instead.
   *
   * [`transfer`]: struct.Pallet.html#method.transfer
   */
  export interface transfer_keep_alive {
    type: "transfer_keep_alive"
    dest: t.sp_runtime.multiaddress.MultiAddress
    value: t.Compact<t.u128>
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
  export interface transfer_all {
    type: "transfer_all"
    dest: t.sp_runtime.multiaddress.MultiAddress
    keep_alive: boolean
  }
  /**
   * Unreserve some balance from a user by force.
   *
   * Can only be called by ROOT.
   */
  export interface force_unreserve {
    type: "force_unreserve"
    who: t.sp_runtime.multiaddress.MultiAddress
    amount: t.u128
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
    value: Omit<t.pallet_balances.pallet.Call.transfer, "type">,
  ): t.pallet_balances.pallet.Call.transfer {
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
  export function set_balance(
    value: Omit<t.pallet_balances.pallet.Call.set_balance, "type">,
  ): t.pallet_balances.pallet.Call.set_balance {
    return { type: "set_balance", ...value }
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
    value: Omit<t.pallet_balances.pallet.Call.force_transfer, "type">,
  ): t.pallet_balances.pallet.Call.force_transfer {
    return { type: "force_transfer", ...value }
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
    value: Omit<t.pallet_balances.pallet.Call.transfer_keep_alive, "type">,
  ): t.pallet_balances.pallet.Call.transfer_keep_alive {
    return { type: "transfer_keep_alive", ...value }
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
    value: Omit<t.pallet_balances.pallet.Call.transfer_all, "type">,
  ): t.pallet_balances.pallet.Call.transfer_all {
    return { type: "transfer_all", ...value }
  }
  /**
   * Unreserve some balance from a user by force.
   *
   * Can only be called by ROOT.
   */
  export function force_unreserve(
    value: Omit<t.pallet_balances.pallet.Call.force_unreserve, "type">,
  ): t.pallet_balances.pallet.Call.force_unreserve {
    return { type: "force_unreserve", ...value }
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
  | t.pallet_balances.pallet.Event.Endowed
  | t.pallet_balances.pallet.Event.DustLost
  | t.pallet_balances.pallet.Event.Transfer
  | t.pallet_balances.pallet.Event.BalanceSet
  | t.pallet_balances.pallet.Event.Reserved
  | t.pallet_balances.pallet.Event.Unreserved
  | t.pallet_balances.pallet.Event.ReserveRepatriated
  | t.pallet_balances.pallet.Event.Deposit
  | t.pallet_balances.pallet.Event.Withdraw
  | t.pallet_balances.pallet.Event.Slashed
export namespace Event {
  /** An account was created with some free balance. */
  export interface Endowed {
    type: "Endowed"
    account: t.sp_core.crypto.AccountId32
    free_balance: t.u128
  }
  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  export interface DustLost {
    type: "DustLost"
    account: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** Transfer succeeded. */
  export interface Transfer {
    type: "Transfer"
    from: t.sp_core.crypto.AccountId32
    to: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** A balance was set by root. */
  export interface BalanceSet {
    type: "BalanceSet"
    who: t.sp_core.crypto.AccountId32
    free: t.u128
    reserved: t.u128
  }
  /** Some balance was reserved (moved from free to reserved). */
  export interface Reserved {
    type: "Reserved"
    who: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** Some balance was unreserved (moved from reserved to free). */
  export interface Unreserved {
    type: "Unreserved"
    who: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  export interface ReserveRepatriated {
    type: "ReserveRepatriated"
    from: t.sp_core.crypto.AccountId32
    to: t.sp_core.crypto.AccountId32
    amount: t.u128
    destination_status: t.frame_support.traits.tokens.misc.BalanceStatus
  }
  /** Some amount was deposited (e.g. for transaction fees). */
  export interface Deposit {
    type: "Deposit"
    who: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** Some amount was withdrawn from the account (e.g. for transaction fees). */
  export interface Withdraw {
    type: "Withdraw"
    who: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** Some amount was removed from the account (e.g. for misbehavior). */
  export interface Slashed {
    type: "Slashed"
    who: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** An account was created with some free balance. */
  export function Endowed(
    value: Omit<t.pallet_balances.pallet.Event.Endowed, "type">,
  ): t.pallet_balances.pallet.Event.Endowed {
    return { type: "Endowed", ...value }
  }
  /**
   * An account was removed whose balance was non-zero but below ExistentialDeposit,
   * resulting in an outright loss.
   */
  export function DustLost(
    value: Omit<t.pallet_balances.pallet.Event.DustLost, "type">,
  ): t.pallet_balances.pallet.Event.DustLost {
    return { type: "DustLost", ...value }
  }
  /** Transfer succeeded. */
  export function Transfer(
    value: Omit<t.pallet_balances.pallet.Event.Transfer, "type">,
  ): t.pallet_balances.pallet.Event.Transfer {
    return { type: "Transfer", ...value }
  }
  /** A balance was set by root. */
  export function BalanceSet(
    value: Omit<t.pallet_balances.pallet.Event.BalanceSet, "type">,
  ): t.pallet_balances.pallet.Event.BalanceSet {
    return { type: "BalanceSet", ...value }
  }
  /** Some balance was reserved (moved from free to reserved). */
  export function Reserved(
    value: Omit<t.pallet_balances.pallet.Event.Reserved, "type">,
  ): t.pallet_balances.pallet.Event.Reserved {
    return { type: "Reserved", ...value }
  }
  /** Some balance was unreserved (moved from reserved to free). */
  export function Unreserved(
    value: Omit<t.pallet_balances.pallet.Event.Unreserved, "type">,
  ): t.pallet_balances.pallet.Event.Unreserved {
    return { type: "Unreserved", ...value }
  }
  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  export function ReserveRepatriated(
    value: Omit<t.pallet_balances.pallet.Event.ReserveRepatriated, "type">,
  ): t.pallet_balances.pallet.Event.ReserveRepatriated {
    return { type: "ReserveRepatriated", ...value }
  }
  /** Some amount was deposited (e.g. for transaction fees). */
  export function Deposit(
    value: Omit<t.pallet_balances.pallet.Event.Deposit, "type">,
  ): t.pallet_balances.pallet.Event.Deposit {
    return { type: "Deposit", ...value }
  }
  /** Some amount was withdrawn from the account (e.g. for transaction fees). */
  export function Withdraw(
    value: Omit<t.pallet_balances.pallet.Event.Withdraw, "type">,
  ): t.pallet_balances.pallet.Event.Withdraw {
    return { type: "Withdraw", ...value }
  }
  /** Some amount was removed from the account (e.g. for misbehavior). */
  export function Slashed(
    value: Omit<t.pallet_balances.pallet.Event.Slashed, "type">,
  ): t.pallet_balances.pallet.Event.Slashed {
    return { type: "Slashed", ...value }
  }
}
