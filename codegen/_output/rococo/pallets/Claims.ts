import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const Claims = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$73),
  value: _codec.$6,
}

/** Pre-claimed Ethereum accounts, by the Account ID that they are claimed to. */
export const Preclaims = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$0),
  value: _codec.$73,
}

/** The statement kind that must be signed, if any. */
export const Signing = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$73),
  value: _codec.$251,
}

export const Total = { type: "Plain", modifier: "Default", hashers: [], key: [], value: _codec.$6 }

/**
 *  Vesting schedule for a claim.
 *  First balance is the total amount that should be held for vesting.
 *  Second balance is how much should be unlocked per block.
 *  The block number is when the vesting should start.
 */
export const Vesting = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Identity"],
  key: $.tuple(_codec.$73),
  value: _codec.$249,
}

/**
 * Attest to a statement, needed to finalize the claims process.
 *
 * WARNING: Insecure unless your chain includes `PrevalidateAttests` as a `SignedExtension`.
 *
 * Unsigned Validation:
 * A call to attest is deemed valid if the sender has a `Preclaim` registered
 * and provides a `statement` which is expected for the account.
 *
 * Parameters:
 * - `statement`: The identity of the statement which is being attested to in the signature.
 *
 * <weight>
 * The weight of this call is invariant over the input parameters.
 * Weight includes logic to do pre-validation on `attest` call.
 *
 * Total Complexity: O(1)
 * </weight>
 */
export function attest(
  value: Omit<t.polkadot_runtime_common.claims.pallet.Call.attest, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "attest" } }
}

/**
 * Make a claim to collect your DOTs.
 *
 * The dispatch origin for this call must be _None_.
 *
 * Unsigned Validation:
 * A call to claim is deemed valid if the signature provided matches
 * the expected signed message of:
 *
 * > Ethereum Signed Message:
 * > (configured prefix string)(address)
 *
 * and `address` matches the `dest` account.
 *
 * Parameters:
 * - `dest`: The destination account to payout the claim.
 * - `ethereum_signature`: The signature of an ethereum signed message
 *    matching the format described above.
 *
 * <weight>
 * The weight of this call is invariant over the input parameters.
 * Weight includes logic to validate unsigned `claim` call.
 *
 * Total Complexity: O(1)
 * </weight>
 */
export function claim(
  value: Omit<t.polkadot_runtime_common.claims.pallet.Call.claim, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "claim" } }
}

/**
 * Make a claim to collect your DOTs by signing a statement.
 *
 * The dispatch origin for this call must be _None_.
 *
 * Unsigned Validation:
 * A call to `claim_attest` is deemed valid if the signature provided matches
 * the expected signed message of:
 *
 * > Ethereum Signed Message:
 * > (configured prefix string)(address)(statement)
 *
 * and `address` matches the `dest` account; the `statement` must match that which is
 * expected according to your purchase arrangement.
 *
 * Parameters:
 * - `dest`: The destination account to payout the claim.
 * - `ethereum_signature`: The signature of an ethereum signed message
 *    matching the format described above.
 * - `statement`: The identity of the statement which is being attested to in the signature.
 *
 * <weight>
 * The weight of this call is invariant over the input parameters.
 * Weight includes logic to validate unsigned `claim_attest` call.
 *
 * Total Complexity: O(1)
 * </weight>
 */
export function claim_attest(
  value: Omit<t.polkadot_runtime_common.claims.pallet.Call.claim_attest, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "claim_attest" } }
}

/**
 * Mint a new claim to collect DOTs.
 *
 * The dispatch origin for this call must be _Root_.
 *
 * Parameters:
 * - `who`: The Ethereum address allowed to collect this claim.
 * - `value`: The number of DOTs that will be claimed.
 * - `vesting_schedule`: An optional vesting schedule for these DOTs.
 *
 * <weight>
 * The weight of this call is invariant over the input parameters.
 * We assume worst case that both vesting and statement is being inserted.
 *
 * Total Complexity: O(1)
 * </weight>
 */
export function mint_claim(
  value: Omit<t.polkadot_runtime_common.claims.pallet.Call.mint_claim, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "mint_claim" } }
}

export function move_claim(
  value: Omit<t.polkadot_runtime_common.claims.pallet.Call.move_claim, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "move_claim" } }
}
