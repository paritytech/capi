import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  Information that is pertinent to identify the entity behind an account.
 *
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export const IdentityOf = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Identity",
  "IdentityOf",
  $.tuple(codecs.$0),
  codecs.$563,
)

/**
 *  The super-identity of an alternative "sub" identity together with its name, within that
 *  context. If the account is not some other account's sub-identity, then just `None`.
 */
export const SuperOf = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Identity",
  "SuperOf",
  $.tuple(codecs.$0),
  codecs.$298,
)

/**
 *  Alternative "sub" identities of this account.
 *
 *  The first item is the deposit, the second is a vector of the accounts.
 *
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export const SubsOf = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Identity",
  "SubsOf",
  $.tuple(codecs.$0),
  codecs.$567,
)

/**
 *  The set of registrars. Not expected to get very big as can only be added through a
 *  special origin (likely a council motion).
 *
 *  The index into this can be cast to `RegistrarIndex` to get a valid value.
 */
export const Registrars = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Identity",
  "Registrars",
  $.tuple(),
  codecs.$569,
)

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
export function addRegistrar(value: Omit<types.pallet_identity.pallet.Call.addRegistrar, "type">) {
  return { type: "Identity", value: { ...value, type: "addRegistrar" } }
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
export function setIdentity(value: Omit<types.pallet_identity.pallet.Call.setIdentity, "type">) {
  return { type: "Identity", value: { ...value, type: "setIdentity" } }
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
export function setSubs(value: Omit<types.pallet_identity.pallet.Call.setSubs, "type">) {
  return { type: "Identity", value: { ...value, type: "setSubs" } }
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
export function clearIdentity() {
  return { type: "Identity", value: { type: "clearIdentity" } }
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
) {
  return { type: "Identity", value: { ...value, type: "requestJudgement" } }
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
) {
  return { type: "Identity", value: { ...value, type: "cancelRequest" } }
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
export function setFee(value: Omit<types.pallet_identity.pallet.Call.setFee, "type">) {
  return { type: "Identity", value: { ...value, type: "setFee" } }
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
export function setAccountId(value: Omit<types.pallet_identity.pallet.Call.setAccountId, "type">) {
  return { type: "Identity", value: { ...value, type: "setAccountId" } }
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
export function setFields(value: Omit<types.pallet_identity.pallet.Call.setFields, "type">) {
  return { type: "Identity", value: { ...value, type: "setFields" } }
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
) {
  return { type: "Identity", value: { ...value, type: "provideJudgement" } }
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
export function killIdentity(value: Omit<types.pallet_identity.pallet.Call.killIdentity, "type">) {
  return { type: "Identity", value: { ...value, type: "killIdentity" } }
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
export function addSub(value: Omit<types.pallet_identity.pallet.Call.addSub, "type">) {
  return { type: "Identity", value: { ...value, type: "addSub" } }
}

/**
 * Alter the associated name of the given sub-account.
 *
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * sub identity of `sub`.
 */
export function renameSub(value: Omit<types.pallet_identity.pallet.Call.renameSub, "type">) {
  return { type: "Identity", value: { ...value, type: "renameSub" } }
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
export function removeSub(value: Omit<types.pallet_identity.pallet.Call.removeSub, "type">) {
  return { type: "Identity", value: { ...value, type: "removeSub" } }
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
export function quitSub() {
  return { type: "Identity", value: { type: "quitSub" } }
}

/** The amount held on deposit for a registered identity */
export const BasicDeposit: types.u128 = codecs.$6.decode(
  C.hex.decode("007db52a2f0000000000000000000000" as C.Hex),
)

/** The amount held on deposit per additional field for a registered identity. */
export const FieldDeposit: types.u128 = codecs.$6.decode(
  C.hex.decode("00cd5627000000000000000000000000" as C.Hex),
)

/**
 *  The amount held on deposit for a registered subaccount. This should account for the fact
 *  that one storage item's value will increase by the size of an account ID, and there will
 *  be another trie item whose value is the size of an account ID plus 32 bytes.
 */
export const SubAccountDeposit: types.u128 = codecs.$6.decode(
  C.hex.decode("80f884b02e0000000000000000000000" as C.Hex),
)

/** The maximum number of sub-accounts allowed per identified account. */
export const MaxSubAccounts: types.u32 = codecs.$4.decode(C.hex.decode("64000000" as C.Hex))

/**
 *  Maximum number of additional fields that may be stored in an ID. Needed to bound the I/O
 *  required to access an identity, but can be pretty high.
 */
export const MaxAdditionalFields: types.u32 = codecs.$4.decode(C.hex.decode("64000000" as C.Hex))

/**
 *  Maxmimum number of registrars allowed in the system. Needed to bound the complexity
 *  of, e.g., updating judgements.
 */
export const MaxRegistrars: types.u32 = codecs.$4.decode(C.hex.decode("14000000" as C.Hex))
