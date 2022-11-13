import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The number of auctions that have entered into their ending period so far. */
export const EndingsCount = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Info on all of the funds. */
export const Funds = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$98),
  value: _codec.$710,
}

/**
 *  The funds that have had additional contributions during the last block. This is used
 *  in order to determine which funds should submit new or updated bids.
 */
export const NewRaise = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$662,
}

/** Tracker for the next available fund index */
export const NextFundIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/**
 * Add an optional memo to an existing crowdloan contribution.
 *
 * Origin must be Signed, and the user must have contributed to the crowdloan.
 */
export function add_memo(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.add_memo, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "add_memo" } }
}

/**
 * Contribute to a crowd sale. This will transfer some balance over to fund a parachain
 * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
 */
export function contribute(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.contribute, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "contribute" } }
}

/**
 * Contribute your entire balance to a crowd sale. This will transfer the entire balance of a user over to fund a parachain
 * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
 */
export function contribute_all(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.contribute_all, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "contribute_all" } }
}

/**
 * Create a new crowdloaning campaign for a parachain slot with the given lease period range.
 *
 * This applies a lock to your parachain configuration, ensuring that it cannot be changed
 * by the parachain manager.
 */
export function create(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.create, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "create" } }
}

/** Remove a fund after the retirement period has ended and all funds have been returned. */
export function dissolve(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.dissolve, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "dissolve" } }
}

/**
 * Edit the configuration for an in-progress crowdloan.
 *
 * Can only be called by Root origin.
 */
export function edit(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.edit, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "edit" } }
}

/**
 * Poke the fund into `NewRaise`
 *
 * Origin must be Signed, and the fund has non-zero raise.
 */
export function poke(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.poke, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "poke" } }
}

/**
 * Automatically refund contributors of an ended crowdloan.
 * Due to weight restrictions, this function may need to be called multiple
 * times to fully refund all users. We will refund `RemoveKeysLimit` users at a time.
 *
 * Origin must be signed, but can come from anyone.
 */
export function refund(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.refund, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "refund" } }
}

/**
 * Withdraw full balance of a specific contributor.
 *
 * Origin must be signed, but can come from anyone.
 *
 * The fund must be either in, or ready for, retirement. For a fund to be *in* retirement, then the retirement
 * flag must be set. For a fund to be ready for retirement, then:
 * - it must not already be in retirement;
 * - the amount of raised funds must be bigger than the _free_ balance of the account;
 * - and either:
 *   - the block number must be at least `end`; or
 *   - the current lease period must be greater than the fund's `last_period`.
 *
 * In this case, the fund's retirement flag is set and its `end` is reset to the current block
 * number.
 *
 * - `who`: The account whose contribution should be withdrawn.
 * - `index`: The parachain to whose crowdloan the contribution was made.
 */
export function withdraw(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.withdraw, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Crowdloan", value: { ...value, type: "withdraw" } }
}
