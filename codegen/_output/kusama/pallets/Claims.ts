import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const Claims = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Claims",
  "Claims",
  $.tuple(codecs.$73),
  codecs.$6,
)

export const Total = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Claims",
  "Total",
  $.tuple(),
  codecs.$6,
)

/**
 *  Vesting schedule for a claim.
 *  First balance is the total amount that should be held for vesting.
 *  Second balance is how much should be unlocked per block.
 *  The block number is when the vesting should start.
 */
export const Vesting = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Claims",
  "Vesting",
  $.tuple(codecs.$73),
  codecs.$249,
)

/** The statement kind that must be signed, if any. */
export const Signing = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Claims",
  "Signing",
  $.tuple(codecs.$73),
  codecs.$251,
)

/** Pre-claimed Ethereum accounts, by the Account ID that they are claimed to. */
export const Preclaims = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Claims",
  "Preclaims",
  $.tuple(codecs.$0),
  codecs.$73,
)

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
  value: Omit<types.polkadot_runtime_common.claims.pallet.Call.claim, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "claim" } }
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
export function mintClaim(
  value: Omit<types.polkadot_runtime_common.claims.pallet.Call.mintClaim, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "mintClaim" } }
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
export function claimAttest(
  value: Omit<types.polkadot_runtime_common.claims.pallet.Call.claimAttest, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "claimAttest" } }
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
  value: Omit<types.polkadot_runtime_common.claims.pallet.Call.attest, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "attest" } }
}

export function moveClaim(
  value: Omit<types.polkadot_runtime_common.claims.pallet.Call.moveClaim, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Claims", value: { ...value, type: "moveClaim" } }
}
