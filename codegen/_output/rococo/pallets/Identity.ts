import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  Information that is pertinent to identify the entity behind an account.
 *
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export const IdentityOf = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$568,
}

/**
 *  The set of registrars. Not expected to get very big as can only be added through a
 *  special origin (likely a council motion).
 *
 *  The index into this can be cast to `RegistrarIndex` to get a valid value.
 */
export const Registrars = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$574,
}

/**
 *  Alternative "sub" identities of this account.
 *
 *  The first item is the deposit, the second is a vector of the accounts.
 *
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export const SubsOf = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$572,
}

/**
 *  The super-identity of an alternative "sub" identity together with its name, within that
 *  context. If the account is not some other account's sub-identity, then just `None`.
 */
export const SuperOf = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Blake2_128Concat"],
  key: $.tuple(_codec.$0),
  value: _codec.$299,
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
  value: Omit<t.types.pallet_identity.pallet.Call.add_registrar, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "add_registrar" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.add_sub, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "add_sub" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.cancel_request, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "cancel_request" } }
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
export function clear_identity(): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { type: "clear_identity" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.kill_identity, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "kill_identity" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.provide_judgement, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "provide_judgement" } }
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
export function quit_sub(): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { type: "quit_sub" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.remove_sub, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "remove_sub" } }
}

/**
 * Alter the associated name of the given sub-account.
 *
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * sub identity of `sub`.
 */
export function rename_sub(
  value: Omit<t.types.pallet_identity.pallet.Call.rename_sub, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "rename_sub" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.request_judgement, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "request_judgement" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.set_account_id, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "set_account_id" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.set_fee, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "set_fee" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.set_fields, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "set_fields" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.set_identity, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "set_identity" } }
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
  value: Omit<t.types.pallet_identity.pallet.Call.set_subs, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "Identity", value: { ...value, type: "set_subs" } }
}
