import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $call: $.Codec<t.types.polkadot_runtime_common.claims.pallet.Call> = _codec.$245

export const $error: $.Codec<t.types.polkadot_runtime_common.claims.pallet.Error> = _codec.$562

export const $event: $.Codec<t.types.polkadot_runtime_common.claims.pallet.Event> = _codec.$72

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.polkadot_runtime_common.claims.pallet.Call.claim
  | t.types.polkadot_runtime_common.claims.pallet.Call.mint_claim
  | t.types.polkadot_runtime_common.claims.pallet.Call.claim_attest
  | t.types.polkadot_runtime_common.claims.pallet.Call.attest
  | t.types.polkadot_runtime_common.claims.pallet.Call.move_claim
export namespace Call {
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
  export interface claim {
    type: "claim"
    dest: t.types.sp_core.crypto.AccountId32
    ethereum_signature: t.types.polkadot_runtime_common.claims.EcdsaSignature
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
  export interface mint_claim {
    type: "mint_claim"
    who: t.types.polkadot_runtime_common.claims.EthereumAddress
    value: t.types.u128
    vesting_schedule: [t.types.u128, t.types.u128, t.types.u32] | undefined
    statement: t.types.polkadot_runtime_common.claims.StatementKind | undefined
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
  export interface claim_attest {
    type: "claim_attest"
    dest: t.types.sp_core.crypto.AccountId32
    ethereum_signature: t.types.polkadot_runtime_common.claims.EcdsaSignature
    statement: Uint8Array
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
  export interface attest {
    type: "attest"
    statement: Uint8Array
  }
  export interface move_claim {
    type: "move_claim"
    old: t.types.polkadot_runtime_common.claims.EthereumAddress
    new: t.types.polkadot_runtime_common.claims.EthereumAddress
    maybe_preclaim: t.types.sp_core.crypto.AccountId32 | undefined
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
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Call.claim, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Call.claim {
    return { type: "claim", ...value }
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
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Call.mint_claim, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Call.mint_claim {
    return { type: "mint_claim", ...value }
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
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Call.claim_attest, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Call.claim_attest {
    return { type: "claim_attest", ...value }
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
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Call.attest, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Call.attest {
    return { type: "attest", ...value }
  }
  export function move_claim(
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Call.move_claim, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Call.move_claim {
    return { type: "move_claim", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "InvalidEthereumSignature"
  | "SignerHasNoClaim"
  | "SenderHasNoClaim"
  | "PotUnderflow"
  | "InvalidStatement"
  | "VestedBalanceExists"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event = t.types.polkadot_runtime_common.claims.pallet.Event.Claimed
export namespace Event {
  /** Someone claimed some DOTs. */
  export interface Claimed {
    type: "Claimed"
    who: t.types.sp_core.crypto.AccountId32
    ethereum_address: t.types.polkadot_runtime_common.claims.EthereumAddress
    amount: t.types.u128
  }
  /** Someone claimed some DOTs. */
  export function Claimed(
    value: Omit<t.types.polkadot_runtime_common.claims.pallet.Event.Claimed, "type">,
  ): t.types.polkadot_runtime_common.claims.pallet.Event.Claimed {
    return { type: "Claimed", ...value }
  }
}
