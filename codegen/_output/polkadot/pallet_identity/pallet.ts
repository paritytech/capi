import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $call: $.Codec<t.pallet_identity.pallet.Call> = _codec.$263

export const $error: $.Codec<t.pallet_identity.pallet.Error> = _codec.$578

export const $event: $.Codec<t.pallet_identity.pallet.Event> = _codec.$77

/** Identity pallet declaration. */
export type Call =
  | t.pallet_identity.pallet.Call.add_registrar
  | t.pallet_identity.pallet.Call.set_identity
  | t.pallet_identity.pallet.Call.set_subs
  | t.pallet_identity.pallet.Call.clear_identity
  | t.pallet_identity.pallet.Call.request_judgement
  | t.pallet_identity.pallet.Call.cancel_request
  | t.pallet_identity.pallet.Call.set_fee
  | t.pallet_identity.pallet.Call.set_account_id
  | t.pallet_identity.pallet.Call.set_fields
  | t.pallet_identity.pallet.Call.provide_judgement
  | t.pallet_identity.pallet.Call.kill_identity
  | t.pallet_identity.pallet.Call.add_sub
  | t.pallet_identity.pallet.Call.rename_sub
  | t.pallet_identity.pallet.Call.remove_sub
  | t.pallet_identity.pallet.Call.quit_sub
export namespace Call {
  /**
   * Add a registrar to the system.
   *
   * The dispatch origin for this call must be `T::RegistrarOrigin`.
   *
   * - `account`: the account of the registrar.
   *
   * Emits `RegistrarAdded` if successful.
   *
   * # <weight>
   * - `O(R)` where `R` registrar-count (governance-bounded and code-bounded).
   * - One storage mutation (codec `O(R)`).
   * - One event.
   * # </weight>
   */
  export interface add_registrar {
    type: "add_registrar"
    account: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Set an account's identity information and reserve the appropriate deposit.
   *
   * If the account already has identity information, the deposit is taken as part payment
   * for the new deposit.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `info`: The identity information.
   *
   * Emits `IdentitySet` if successful.
   *
   * # <weight>
   * - `O(X + X' + R)`
   *   - where `X` additional-field-count (deposit-bounded and code-bounded)
   *   - where `R` judgements-count (registrar-count-bounded)
   * - One balance reserve operation.
   * - One storage mutation (codec-read `O(X' + R)`, codec-write `O(X + R)`).
   * - One event.
   * # </weight>
   */
  export interface set_identity {
    type: "set_identity"
    info: t.pallet_identity.types.IdentityInfo
  }
  /**
   * Set the sub-accounts of the sender.
   *
   * Payment: Any aggregate balance reserved by previous `set_subs` calls will be returned
   * and an amount `SubAccountDeposit` will be reserved for each item in `subs`.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * identity.
   *
   * - `subs`: The identity's (new) sub-accounts.
   *
   * # <weight>
   * - `O(P + S)`
   *   - where `P` old-subs-count (hard- and deposit-bounded).
   *   - where `S` subs-count (hard- and deposit-bounded).
   * - At most one balance operations.
   * - DB:
   *   - `P + S` storage mutations (codec complexity `O(1)`)
   *   - One storage read (codec complexity `O(P)`).
   *   - One storage write (codec complexity `O(S)`).
   *   - One storage-exists (`IdentityOf::contains_key`).
   * # </weight>
   */
  export interface set_subs {
    type: "set_subs"
    subs: Array<[t.sp_core.crypto.AccountId32, t.pallet_identity.types.Data]>
  }
  /**
   * Clear an account's identity info and all sub-accounts and return all deposits.
   *
   * Payment: All reserved balances on the account are returned.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * identity.
   *
   * Emits `IdentityCleared` if successful.
   *
   * # <weight>
   * - `O(R + S + X)`
   *   - where `R` registrar-count (governance-bounded).
   *   - where `S` subs-count (hard- and deposit-bounded).
   *   - where `X` additional-field-count (deposit-bounded and code-bounded).
   * - One balance-unreserve operation.
   * - `2` storage reads and `S + 2` storage deletions.
   * - One event.
   * # </weight>
   */
  export interface clear_identity {
    type: "clear_identity"
  }
  /**
   * Request a judgement from a registrar.
   *
   * Payment: At most `max_fee` will be reserved for payment to the registrar if judgement
   * given.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a
   * registered identity.
   *
   * - `reg_index`: The index of the registrar whose judgement is requested.
   * - `max_fee`: The maximum fee that may be paid. This should just be auto-populated as:
   *
   * ```nocompile
   * Self::registrars().get(reg_index).unwrap().fee
   * ```
   *
   * Emits `JudgementRequested` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-reserve operation.
   * - Storage: 1 read `O(R)`, 1 mutate `O(X + R)`.
   * - One event.
   * # </weight>
   */
  export interface request_judgement {
    type: "request_judgement"
    reg_index: t.Compact<t.u32>
    max_fee: t.Compact<t.u128>
  }
  /**
   * Cancel a previous request.
   *
   * Payment: A previously reserved deposit is returned on success.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a
   * registered identity.
   *
   * - `reg_index`: The index of the registrar whose judgement is no longer requested.
   *
   * Emits `JudgementUnrequested` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-reserve operation.
   * - One storage mutation `O(R + X)`.
   * - One event
   * # </weight>
   */
  export interface cancel_request {
    type: "cancel_request"
    reg_index: t.u32
  }
  /**
   * Set the fee required for a judgement to be requested from a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `fee`: the new fee.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 7.315 + R * 0.329 µs (min squares analysis)
   * # </weight>
   */
  export interface set_fee {
    type: "set_fee"
    index: t.Compact<t.u32>
    fee: t.Compact<t.u128>
  }
  /**
   * Change the account associated with a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `new`: the new account ID.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 8.823 + R * 0.32 µs (min squares analysis)
   * # </weight>
   */
  export interface set_account_id {
    type: "set_account_id"
    index: t.Compact<t.u32>
    new: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Set the field information for a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `fields`: the fields that the registrar concerns themselves with.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 7.464 + R * 0.325 µs (min squares analysis)
   * # </weight>
   */
  export interface set_fields {
    type: "set_fields"
    index: t.Compact<t.u32>
    fields: t.u64
  }
  /**
   * Provide a judgement for an account's identity.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `reg_index`.
   *
   * - `reg_index`: the index of the registrar whose judgement is being made.
   * - `target`: the account whose identity the judgement is upon. This must be an account
   *   with a registered identity.
   * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
   * - `identity`: The hash of the [`IdentityInfo`] for that the judgement is provided.
   *
   * Emits `JudgementGiven` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-transfer operation.
   * - Up to one account-lookup operation.
   * - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
   * - One event.
   * # </weight>
   */
  export interface provide_judgement {
    type: "provide_judgement"
    reg_index: t.Compact<t.u32>
    target: t.sp_runtime.multiaddress.MultiAddress
    judgement: t.pallet_identity.types.Judgement
    identity: t.primitive_types.H256
  }
  /**
   * Remove an account's identity and sub-account information and slash the deposits.
   *
   * Payment: Reserved balances from `set_subs` and `set_identity` are slashed and handled by
   * `Slash`. Verification request deposits are not returned; they should be cancelled
   * manually using `cancel_request`.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   *
   * - `target`: the account whose identity the judgement is upon. This must be an account
   *   with a registered identity.
   *
   * Emits `IdentityKilled` if successful.
   *
   * # <weight>
   * - `O(R + S + X)`.
   * - One balance-reserve operation.
   * - `S + 2` storage mutations.
   * - One event.
   * # </weight>
   */
  export interface kill_identity {
    type: "kill_identity"
    target: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Add the given account to the sender's subs.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export interface add_sub {
    type: "add_sub"
    sub: t.sp_runtime.multiaddress.MultiAddress
    data: t.pallet_identity.types.Data
  }
  /**
   * Alter the associated name of the given sub-account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export interface rename_sub {
    type: "rename_sub"
    sub: t.sp_runtime.multiaddress.MultiAddress
    data: t.pallet_identity.types.Data
  }
  /**
   * Remove the given account from the sender's subs.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export interface remove_sub {
    type: "remove_sub"
    sub: t.sp_runtime.multiaddress.MultiAddress
  }
  /**
   * Remove the sender as a sub-account.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender (*not* the original depositor).
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * super-identity.
   *
   * NOTE: This should not normally be used, but is provided in the case that the non-
   * controller of an account is maliciously registered as a sub-account.
   */
  export interface quit_sub {
    type: "quit_sub"
  }
  /**
   * Add a registrar to the system.
   *
   * The dispatch origin for this call must be `T::RegistrarOrigin`.
   *
   * - `account`: the account of the registrar.
   *
   * Emits `RegistrarAdded` if successful.
   *
   * # <weight>
   * - `O(R)` where `R` registrar-count (governance-bounded and code-bounded).
   * - One storage mutation (codec `O(R)`).
   * - One event.
   * # </weight>
   */
  export function add_registrar(
    value: Omit<t.pallet_identity.pallet.Call.add_registrar, "type">,
  ): t.pallet_identity.pallet.Call.add_registrar {
    return { type: "add_registrar", ...value }
  }
  /**
   * Set an account's identity information and reserve the appropriate deposit.
   *
   * If the account already has identity information, the deposit is taken as part payment
   * for the new deposit.
   *
   * The dispatch origin for this call must be _Signed_.
   *
   * - `info`: The identity information.
   *
   * Emits `IdentitySet` if successful.
   *
   * # <weight>
   * - `O(X + X' + R)`
   *   - where `X` additional-field-count (deposit-bounded and code-bounded)
   *   - where `R` judgements-count (registrar-count-bounded)
   * - One balance reserve operation.
   * - One storage mutation (codec-read `O(X' + R)`, codec-write `O(X + R)`).
   * - One event.
   * # </weight>
   */
  export function set_identity(
    value: Omit<t.pallet_identity.pallet.Call.set_identity, "type">,
  ): t.pallet_identity.pallet.Call.set_identity {
    return { type: "set_identity", ...value }
  }
  /**
   * Set the sub-accounts of the sender.
   *
   * Payment: Any aggregate balance reserved by previous `set_subs` calls will be returned
   * and an amount `SubAccountDeposit` will be reserved for each item in `subs`.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * identity.
   *
   * - `subs`: The identity's (new) sub-accounts.
   *
   * # <weight>
   * - `O(P + S)`
   *   - where `P` old-subs-count (hard- and deposit-bounded).
   *   - where `S` subs-count (hard- and deposit-bounded).
   * - At most one balance operations.
   * - DB:
   *   - `P + S` storage mutations (codec complexity `O(1)`)
   *   - One storage read (codec complexity `O(P)`).
   *   - One storage write (codec complexity `O(S)`).
   *   - One storage-exists (`IdentityOf::contains_key`).
   * # </weight>
   */
  export function set_subs(
    value: Omit<t.pallet_identity.pallet.Call.set_subs, "type">,
  ): t.pallet_identity.pallet.Call.set_subs {
    return { type: "set_subs", ...value }
  }
  /**
   * Clear an account's identity info and all sub-accounts and return all deposits.
   *
   * Payment: All reserved balances on the account are returned.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * identity.
   *
   * Emits `IdentityCleared` if successful.
   *
   * # <weight>
   * - `O(R + S + X)`
   *   - where `R` registrar-count (governance-bounded).
   *   - where `S` subs-count (hard- and deposit-bounded).
   *   - where `X` additional-field-count (deposit-bounded and code-bounded).
   * - One balance-unreserve operation.
   * - `2` storage reads and `S + 2` storage deletions.
   * - One event.
   * # </weight>
   */
  export function clear_identity(): t.pallet_identity.pallet.Call.clear_identity {
    return { type: "clear_identity" }
  }
  /**
   * Request a judgement from a registrar.
   *
   * Payment: At most `max_fee` will be reserved for payment to the registrar if judgement
   * given.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a
   * registered identity.
   *
   * - `reg_index`: The index of the registrar whose judgement is requested.
   * - `max_fee`: The maximum fee that may be paid. This should just be auto-populated as:
   *
   * ```nocompile
   * Self::registrars().get(reg_index).unwrap().fee
   * ```
   *
   * Emits `JudgementRequested` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-reserve operation.
   * - Storage: 1 read `O(R)`, 1 mutate `O(X + R)`.
   * - One event.
   * # </weight>
   */
  export function request_judgement(
    value: Omit<t.pallet_identity.pallet.Call.request_judgement, "type">,
  ): t.pallet_identity.pallet.Call.request_judgement {
    return { type: "request_judgement", ...value }
  }
  /**
   * Cancel a previous request.
   *
   * Payment: A previously reserved deposit is returned on success.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a
   * registered identity.
   *
   * - `reg_index`: The index of the registrar whose judgement is no longer requested.
   *
   * Emits `JudgementUnrequested` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-reserve operation.
   * - One storage mutation `O(R + X)`.
   * - One event
   * # </weight>
   */
  export function cancel_request(
    value: Omit<t.pallet_identity.pallet.Call.cancel_request, "type">,
  ): t.pallet_identity.pallet.Call.cancel_request {
    return { type: "cancel_request", ...value }
  }
  /**
   * Set the fee required for a judgement to be requested from a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `fee`: the new fee.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 7.315 + R * 0.329 µs (min squares analysis)
   * # </weight>
   */
  export function set_fee(
    value: Omit<t.pallet_identity.pallet.Call.set_fee, "type">,
  ): t.pallet_identity.pallet.Call.set_fee {
    return { type: "set_fee", ...value }
  }
  /**
   * Change the account associated with a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `new`: the new account ID.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 8.823 + R * 0.32 µs (min squares analysis)
   * # </weight>
   */
  export function set_account_id(
    value: Omit<t.pallet_identity.pallet.Call.set_account_id, "type">,
  ): t.pallet_identity.pallet.Call.set_account_id {
    return { type: "set_account_id", ...value }
  }
  /**
   * Set the field information for a registrar.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `index`.
   *
   * - `index`: the index of the registrar whose fee is to be set.
   * - `fields`: the fields that the registrar concerns themselves with.
   *
   * # <weight>
   * - `O(R)`.
   * - One storage mutation `O(R)`.
   * - Benchmark: 7.464 + R * 0.325 µs (min squares analysis)
   * # </weight>
   */
  export function set_fields(
    value: Omit<t.pallet_identity.pallet.Call.set_fields, "type">,
  ): t.pallet_identity.pallet.Call.set_fields {
    return { type: "set_fields", ...value }
  }
  /**
   * Provide a judgement for an account's identity.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must be the account
   * of the registrar whose index is `reg_index`.
   *
   * - `reg_index`: the index of the registrar whose judgement is being made.
   * - `target`: the account whose identity the judgement is upon. This must be an account
   *   with a registered identity.
   * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
   * - `identity`: The hash of the [`IdentityInfo`] for that the judgement is provided.
   *
   * Emits `JudgementGiven` if successful.
   *
   * # <weight>
   * - `O(R + X)`.
   * - One balance-transfer operation.
   * - Up to one account-lookup operation.
   * - Storage: 1 read `O(R)`, 1 mutate `O(R + X)`.
   * - One event.
   * # </weight>
   */
  export function provide_judgement(
    value: Omit<t.pallet_identity.pallet.Call.provide_judgement, "type">,
  ): t.pallet_identity.pallet.Call.provide_judgement {
    return { type: "provide_judgement", ...value }
  }
  /**
   * Remove an account's identity and sub-account information and slash the deposits.
   *
   * Payment: Reserved balances from `set_subs` and `set_identity` are slashed and handled by
   * `Slash`. Verification request deposits are not returned; they should be cancelled
   * manually using `cancel_request`.
   *
   * The dispatch origin for this call must match `T::ForceOrigin`.
   *
   * - `target`: the account whose identity the judgement is upon. This must be an account
   *   with a registered identity.
   *
   * Emits `IdentityKilled` if successful.
   *
   * # <weight>
   * - `O(R + S + X)`.
   * - One balance-reserve operation.
   * - `S + 2` storage mutations.
   * - One event.
   * # </weight>
   */
  export function kill_identity(
    value: Omit<t.pallet_identity.pallet.Call.kill_identity, "type">,
  ): t.pallet_identity.pallet.Call.kill_identity {
    return { type: "kill_identity", ...value }
  }
  /**
   * Add the given account to the sender's subs.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export function add_sub(
    value: Omit<t.pallet_identity.pallet.Call.add_sub, "type">,
  ): t.pallet_identity.pallet.Call.add_sub {
    return { type: "add_sub", ...value }
  }
  /**
   * Alter the associated name of the given sub-account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export function rename_sub(
    value: Omit<t.pallet_identity.pallet.Call.rename_sub, "type">,
  ): t.pallet_identity.pallet.Call.rename_sub {
    return { type: "rename_sub", ...value }
  }
  /**
   * Remove the given account from the sender's subs.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export function remove_sub(
    value: Omit<t.pallet_identity.pallet.Call.remove_sub, "type">,
  ): t.pallet_identity.pallet.Call.remove_sub {
    return { type: "remove_sub", ...value }
  }
  /**
   * Remove the sender as a sub-account.
   *
   * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
   * to the sender (*not* the original depositor).
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * super-identity.
   *
   * NOTE: This should not normally be used, but is provided in the case that the non-
   * controller of an account is maliciously registered as a sub-account.
   */
  export function quit_sub(): t.pallet_identity.pallet.Call.quit_sub {
    return { type: "quit_sub" }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "TooManySubAccounts"
  | "NotFound"
  | "NotNamed"
  | "EmptyIndex"
  | "FeeChanged"
  | "NoIdentity"
  | "StickyJudgement"
  | "JudgementGiven"
  | "InvalidJudgement"
  | "InvalidIndex"
  | "InvalidTarget"
  | "TooManyFields"
  | "TooManyRegistrars"
  | "AlreadyClaimed"
  | "NotSub"
  | "NotOwned"
  | "JudgementForDifferentIdentity"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.pallet_identity.pallet.Event.IdentitySet
  | t.pallet_identity.pallet.Event.IdentityCleared
  | t.pallet_identity.pallet.Event.IdentityKilled
  | t.pallet_identity.pallet.Event.JudgementRequested
  | t.pallet_identity.pallet.Event.JudgementUnrequested
  | t.pallet_identity.pallet.Event.JudgementGiven
  | t.pallet_identity.pallet.Event.RegistrarAdded
  | t.pallet_identity.pallet.Event.SubIdentityAdded
  | t.pallet_identity.pallet.Event.SubIdentityRemoved
  | t.pallet_identity.pallet.Event.SubIdentityRevoked
export namespace Event {
  /** A name was set or reset (which will remove all judgements). */
  export interface IdentitySet {
    type: "IdentitySet"
    who: t.sp_core.crypto.AccountId32
  }
  /** A name was cleared, and the given balance returned. */
  export interface IdentityCleared {
    type: "IdentityCleared"
    who: t.sp_core.crypto.AccountId32
    deposit: t.u128
  }
  /** A name was removed and the given balance slashed. */
  export interface IdentityKilled {
    type: "IdentityKilled"
    who: t.sp_core.crypto.AccountId32
    deposit: t.u128
  }
  /** A judgement was asked from a registrar. */
  export interface JudgementRequested {
    type: "JudgementRequested"
    who: t.sp_core.crypto.AccountId32
    registrar_index: t.u32
  }
  /** A judgement request was retracted. */
  export interface JudgementUnrequested {
    type: "JudgementUnrequested"
    who: t.sp_core.crypto.AccountId32
    registrar_index: t.u32
  }
  /** A judgement was given by a registrar. */
  export interface JudgementGiven {
    type: "JudgementGiven"
    target: t.sp_core.crypto.AccountId32
    registrar_index: t.u32
  }
  /** A registrar was added. */
  export interface RegistrarAdded {
    type: "RegistrarAdded"
    registrar_index: t.u32
  }
  /** A sub-identity was added to an identity and the deposit paid. */
  export interface SubIdentityAdded {
    type: "SubIdentityAdded"
    sub: t.sp_core.crypto.AccountId32
    main: t.sp_core.crypto.AccountId32
    deposit: t.u128
  }
  /** A sub-identity was removed from an identity and the deposit freed. */
  export interface SubIdentityRemoved {
    type: "SubIdentityRemoved"
    sub: t.sp_core.crypto.AccountId32
    main: t.sp_core.crypto.AccountId32
    deposit: t.u128
  }
  /**
   * A sub-identity was cleared, and the given deposit repatriated from the
   * main identity account to the sub-identity account.
   */
  export interface SubIdentityRevoked {
    type: "SubIdentityRevoked"
    sub: t.sp_core.crypto.AccountId32
    main: t.sp_core.crypto.AccountId32
    deposit: t.u128
  }
  /** A name was set or reset (which will remove all judgements). */
  export function IdentitySet(
    value: Omit<t.pallet_identity.pallet.Event.IdentitySet, "type">,
  ): t.pallet_identity.pallet.Event.IdentitySet {
    return { type: "IdentitySet", ...value }
  }
  /** A name was cleared, and the given balance returned. */
  export function IdentityCleared(
    value: Omit<t.pallet_identity.pallet.Event.IdentityCleared, "type">,
  ): t.pallet_identity.pallet.Event.IdentityCleared {
    return { type: "IdentityCleared", ...value }
  }
  /** A name was removed and the given balance slashed. */
  export function IdentityKilled(
    value: Omit<t.pallet_identity.pallet.Event.IdentityKilled, "type">,
  ): t.pallet_identity.pallet.Event.IdentityKilled {
    return { type: "IdentityKilled", ...value }
  }
  /** A judgement was asked from a registrar. */
  export function JudgementRequested(
    value: Omit<t.pallet_identity.pallet.Event.JudgementRequested, "type">,
  ): t.pallet_identity.pallet.Event.JudgementRequested {
    return { type: "JudgementRequested", ...value }
  }
  /** A judgement request was retracted. */
  export function JudgementUnrequested(
    value: Omit<t.pallet_identity.pallet.Event.JudgementUnrequested, "type">,
  ): t.pallet_identity.pallet.Event.JudgementUnrequested {
    return { type: "JudgementUnrequested", ...value }
  }
  /** A judgement was given by a registrar. */
  export function JudgementGiven(
    value: Omit<t.pallet_identity.pallet.Event.JudgementGiven, "type">,
  ): t.pallet_identity.pallet.Event.JudgementGiven {
    return { type: "JudgementGiven", ...value }
  }
  /** A registrar was added. */
  export function RegistrarAdded(
    value: Omit<t.pallet_identity.pallet.Event.RegistrarAdded, "type">,
  ): t.pallet_identity.pallet.Event.RegistrarAdded {
    return { type: "RegistrarAdded", ...value }
  }
  /** A sub-identity was added to an identity and the deposit paid. */
  export function SubIdentityAdded(
    value: Omit<t.pallet_identity.pallet.Event.SubIdentityAdded, "type">,
  ): t.pallet_identity.pallet.Event.SubIdentityAdded {
    return { type: "SubIdentityAdded", ...value }
  }
  /** A sub-identity was removed from an identity and the deposit freed. */
  export function SubIdentityRemoved(
    value: Omit<t.pallet_identity.pallet.Event.SubIdentityRemoved, "type">,
  ): t.pallet_identity.pallet.Event.SubIdentityRemoved {
    return { type: "SubIdentityRemoved", ...value }
  }
  /**
   * A sub-identity was cleared, and the given deposit repatriated from the
   * main identity account to the sub-identity account.
   */
  export function SubIdentityRevoked(
    value: Omit<t.pallet_identity.pallet.Event.SubIdentityRevoked, "type">,
  ): t.pallet_identity.pallet.Event.SubIdentityRevoked {
    return { type: "SubIdentityRevoked", ...value }
  }
}
