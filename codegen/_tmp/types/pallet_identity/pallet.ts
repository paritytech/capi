import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_identity.pallet.Call> = codecs.$262
/** Identity pallet declaration. */

export type Call =
  | types.pallet_identity.pallet.Call.addRegistrar
  | types.pallet_identity.pallet.Call.setIdentity
  | types.pallet_identity.pallet.Call.setSubs
  | types.pallet_identity.pallet.Call.clearIdentity
  | types.pallet_identity.pallet.Call.requestJudgement
  | types.pallet_identity.pallet.Call.cancelRequest
  | types.pallet_identity.pallet.Call.setFee
  | types.pallet_identity.pallet.Call.setAccountId
  | types.pallet_identity.pallet.Call.setFields
  | types.pallet_identity.pallet.Call.provideJudgement
  | types.pallet_identity.pallet.Call.killIdentity
  | types.pallet_identity.pallet.Call.addSub
  | types.pallet_identity.pallet.Call.renameSub
  | types.pallet_identity.pallet.Call.removeSub
  | types.pallet_identity.pallet.Call.quitSub
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
  export interface addRegistrar {
    type: "addRegistrar"
    account: types.sp_runtime.multiaddress.MultiAddress
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
  export interface setIdentity {
    type: "setIdentity"
    info: types.pallet_identity.types.IdentityInfo
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
  export interface setSubs {
    type: "setSubs"
    subs: Array<[types.sp_core.crypto.AccountId32, types.pallet_identity.types.Data]>
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
  export interface clearIdentity {
    type: "clearIdentity"
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
  export interface requestJudgement {
    type: "requestJudgement"
    regIndex: types.Compact<types.u32>
    maxFee: types.Compact<types.u128>
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
  export interface cancelRequest {
    type: "cancelRequest"
    regIndex: types.u32
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
  export interface setFee {
    type: "setFee"
    index: types.Compact<types.u32>
    fee: types.Compact<types.u128>
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
  export interface setAccountId {
    type: "setAccountId"
    index: types.Compact<types.u32>
    new: types.sp_runtime.multiaddress.MultiAddress
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
  export interface setFields {
    type: "setFields"
    index: types.Compact<types.u32>
    fields: types.u64
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
  export interface provideJudgement {
    type: "provideJudgement"
    regIndex: types.Compact<types.u32>
    target: types.sp_runtime.multiaddress.MultiAddress
    judgement: types.pallet_identity.types.Judgement
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
  export interface killIdentity {
    type: "killIdentity"
    target: types.sp_runtime.multiaddress.MultiAddress
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
  export interface addSub {
    type: "addSub"
    sub: types.sp_runtime.multiaddress.MultiAddress
    data: types.pallet_identity.types.Data
  }
  /**
   * Alter the associated name of the given sub-account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export interface renameSub {
    type: "renameSub"
    sub: types.sp_runtime.multiaddress.MultiAddress
    data: types.pallet_identity.types.Data
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
  export interface removeSub {
    type: "removeSub"
    sub: types.sp_runtime.multiaddress.MultiAddress
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
  export interface quitSub {
    type: "quitSub"
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
  export function addRegistrar(
    value: Omit<types.pallet_identity.pallet.Call.addRegistrar, "type">,
  ): types.pallet_identity.pallet.Call.addRegistrar {
    return { type: "addRegistrar", ...value }
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
  export function setIdentity(
    value: Omit<types.pallet_identity.pallet.Call.setIdentity, "type">,
  ): types.pallet_identity.pallet.Call.setIdentity {
    return { type: "setIdentity", ...value }
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
  export function setSubs(
    value: Omit<types.pallet_identity.pallet.Call.setSubs, "type">,
  ): types.pallet_identity.pallet.Call.setSubs {
    return { type: "setSubs", ...value }
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
  export function clearIdentity(): types.pallet_identity.pallet.Call.clearIdentity {
    return { type: "clearIdentity" }
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
  export function requestJudgement(
    value: Omit<types.pallet_identity.pallet.Call.requestJudgement, "type">,
  ): types.pallet_identity.pallet.Call.requestJudgement {
    return { type: "requestJudgement", ...value }
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
  export function cancelRequest(
    value: Omit<types.pallet_identity.pallet.Call.cancelRequest, "type">,
  ): types.pallet_identity.pallet.Call.cancelRequest {
    return { type: "cancelRequest", ...value }
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
  export function setFee(
    value: Omit<types.pallet_identity.pallet.Call.setFee, "type">,
  ): types.pallet_identity.pallet.Call.setFee {
    return { type: "setFee", ...value }
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
  export function setAccountId(
    value: Omit<types.pallet_identity.pallet.Call.setAccountId, "type">,
  ): types.pallet_identity.pallet.Call.setAccountId {
    return { type: "setAccountId", ...value }
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
  export function setFields(
    value: Omit<types.pallet_identity.pallet.Call.setFields, "type">,
  ): types.pallet_identity.pallet.Call.setFields {
    return { type: "setFields", ...value }
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
  export function provideJudgement(
    value: Omit<types.pallet_identity.pallet.Call.provideJudgement, "type">,
  ): types.pallet_identity.pallet.Call.provideJudgement {
    return { type: "provideJudgement", ...value }
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
  export function killIdentity(
    value: Omit<types.pallet_identity.pallet.Call.killIdentity, "type">,
  ): types.pallet_identity.pallet.Call.killIdentity {
    return { type: "killIdentity", ...value }
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
  export function addSub(
    value: Omit<types.pallet_identity.pallet.Call.addSub, "type">,
  ): types.pallet_identity.pallet.Call.addSub {
    return { type: "addSub", ...value }
  }
  /**
   * Alter the associated name of the given sub-account.
   *
   * The dispatch origin for this call must be _Signed_ and the sender must have a registered
   * sub identity of `sub`.
   */
  export function renameSub(
    value: Omit<types.pallet_identity.pallet.Call.renameSub, "type">,
  ): types.pallet_identity.pallet.Call.renameSub {
    return { type: "renameSub", ...value }
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
  export function removeSub(
    value: Omit<types.pallet_identity.pallet.Call.removeSub, "type">,
  ): types.pallet_identity.pallet.Call.removeSub {
    return { type: "removeSub", ...value }
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
  export function quitSub(): types.pallet_identity.pallet.Call.quitSub {
    return { type: "quitSub" }
  }
}

export const $error: $.Codec<types.pallet_identity.pallet.Error> = codecs.$573
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

export const $event: $.Codec<types.pallet_identity.pallet.Event> = codecs.$78
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_identity.pallet.Event.IdentitySet
  | types.pallet_identity.pallet.Event.IdentityCleared
  | types.pallet_identity.pallet.Event.IdentityKilled
  | types.pallet_identity.pallet.Event.JudgementRequested
  | types.pallet_identity.pallet.Event.JudgementUnrequested
  | types.pallet_identity.pallet.Event.JudgementGiven
  | types.pallet_identity.pallet.Event.RegistrarAdded
  | types.pallet_identity.pallet.Event.SubIdentityAdded
  | types.pallet_identity.pallet.Event.SubIdentityRemoved
  | types.pallet_identity.pallet.Event.SubIdentityRevoked
export namespace Event {
  /** A name was set or reset (which will remove all judgements). */
  export interface IdentitySet {
    type: "IdentitySet"
    who: types.sp_core.crypto.AccountId32
  }
  /** A name was cleared, and the given balance returned. */
  export interface IdentityCleared {
    type: "IdentityCleared"
    who: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A name was removed and the given balance slashed. */
  export interface IdentityKilled {
    type: "IdentityKilled"
    who: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A judgement was asked from a registrar. */
  export interface JudgementRequested {
    type: "JudgementRequested"
    who: types.sp_core.crypto.AccountId32
    registrarIndex: types.u32
  }
  /** A judgement request was retracted. */
  export interface JudgementUnrequested {
    type: "JudgementUnrequested"
    who: types.sp_core.crypto.AccountId32
    registrarIndex: types.u32
  }
  /** A judgement was given by a registrar. */
  export interface JudgementGiven {
    type: "JudgementGiven"
    target: types.sp_core.crypto.AccountId32
    registrarIndex: types.u32
  }
  /** A registrar was added. */
  export interface RegistrarAdded {
    type: "RegistrarAdded"
    registrarIndex: types.u32
  }
  /** A sub-identity was added to an identity and the deposit paid. */
  export interface SubIdentityAdded {
    type: "SubIdentityAdded"
    sub: types.sp_core.crypto.AccountId32
    main: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A sub-identity was removed from an identity and the deposit freed. */
  export interface SubIdentityRemoved {
    type: "SubIdentityRemoved"
    sub: types.sp_core.crypto.AccountId32
    main: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /**
   * A sub-identity was cleared, and the given deposit repatriated from the
   * main identity account to the sub-identity account.
   */
  export interface SubIdentityRevoked {
    type: "SubIdentityRevoked"
    sub: types.sp_core.crypto.AccountId32
    main: types.sp_core.crypto.AccountId32
    deposit: types.u128
  }
  /** A name was set or reset (which will remove all judgements). */
  export function IdentitySet(
    value: Omit<types.pallet_identity.pallet.Event.IdentitySet, "type">,
  ): types.pallet_identity.pallet.Event.IdentitySet {
    return { type: "IdentitySet", ...value }
  }
  /** A name was cleared, and the given balance returned. */
  export function IdentityCleared(
    value: Omit<types.pallet_identity.pallet.Event.IdentityCleared, "type">,
  ): types.pallet_identity.pallet.Event.IdentityCleared {
    return { type: "IdentityCleared", ...value }
  }
  /** A name was removed and the given balance slashed. */
  export function IdentityKilled(
    value: Omit<types.pallet_identity.pallet.Event.IdentityKilled, "type">,
  ): types.pallet_identity.pallet.Event.IdentityKilled {
    return { type: "IdentityKilled", ...value }
  }
  /** A judgement was asked from a registrar. */
  export function JudgementRequested(
    value: Omit<types.pallet_identity.pallet.Event.JudgementRequested, "type">,
  ): types.pallet_identity.pallet.Event.JudgementRequested {
    return { type: "JudgementRequested", ...value }
  }
  /** A judgement request was retracted. */
  export function JudgementUnrequested(
    value: Omit<types.pallet_identity.pallet.Event.JudgementUnrequested, "type">,
  ): types.pallet_identity.pallet.Event.JudgementUnrequested {
    return { type: "JudgementUnrequested", ...value }
  }
  /** A judgement was given by a registrar. */
  export function JudgementGiven(
    value: Omit<types.pallet_identity.pallet.Event.JudgementGiven, "type">,
  ): types.pallet_identity.pallet.Event.JudgementGiven {
    return { type: "JudgementGiven", ...value }
  }
  /** A registrar was added. */
  export function RegistrarAdded(
    value: Omit<types.pallet_identity.pallet.Event.RegistrarAdded, "type">,
  ): types.pallet_identity.pallet.Event.RegistrarAdded {
    return { type: "RegistrarAdded", ...value }
  }
  /** A sub-identity was added to an identity and the deposit paid. */
  export function SubIdentityAdded(
    value: Omit<types.pallet_identity.pallet.Event.SubIdentityAdded, "type">,
  ): types.pallet_identity.pallet.Event.SubIdentityAdded {
    return { type: "SubIdentityAdded", ...value }
  }
  /** A sub-identity was removed from an identity and the deposit freed. */
  export function SubIdentityRemoved(
    value: Omit<types.pallet_identity.pallet.Event.SubIdentityRemoved, "type">,
  ): types.pallet_identity.pallet.Event.SubIdentityRemoved {
    return { type: "SubIdentityRemoved", ...value }
  }
  /**
   * A sub-identity was cleared, and the given deposit repatriated from the
   * main identity account to the sub-identity account.
   */
  export function SubIdentityRevoked(
    value: Omit<types.pallet_identity.pallet.Event.SubIdentityRevoked, "type">,
  ): types.pallet_identity.pallet.Event.SubIdentityRevoked {
    return { type: "SubIdentityRevoked", ...value }
  }
}
