import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Info on all of the funds. */
export const Funds = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Crowdloan",
  "Funds",
  $.tuple(codecs.$97),
  codecs.$702,
)

/**
 *  The funds that have had additional contributions during the last block. This is used
 *  in order to determine which funds should submit new or updated bids.
 */
export const NewRaise = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Crowdloan",
  "NewRaise",
  $.tuple(),
  codecs.$654,
)

/** The number of auctions that have entered into their ending period so far. */
export const EndingsCount = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Crowdloan",
  "EndingsCount",
  $.tuple(),
  codecs.$4,
)

/** Tracker for the next available fund index */
export const NextFundIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Crowdloan",
  "NextFundIndex",
  $.tuple(),
  codecs.$4,
)

/**
 * Create a new crowdloaning campaign for a parachain slot with the given lease period range.
 *
 * This applies a lock to your parachain configuration, ensuring that it cannot be changed
 * by the parachain manager.
 */
export function create(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.create, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "create" } }
}

/**
 * Contribute to a crowd sale. This will transfer some balance over to fund a parachain
 * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
 */
export function contribute(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.contribute, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "contribute" } }
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
) {
  return { type: "Crowdloan", value: { ...value, type: "withdraw" } }
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
) {
  return { type: "Crowdloan", value: { ...value, type: "refund" } }
}

/** Remove a fund after the retirement period has ended and all funds have been returned. */
export function dissolve(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.dissolve, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "dissolve" } }
}

/**
 * Edit the configuration for an in-progress crowdloan.
 *
 * Can only be called by Root origin.
 */
export function edit(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.edit, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "edit" } }
}

/**
 * Add an optional memo to an existing crowdloan contribution.
 *
 * Origin must be Signed, and the user must have contributed to the crowdloan.
 */
export function addMemo(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.addMemo, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "addMemo" } }
}

/**
 * Poke the fund into `NewRaise`
 *
 * Origin must be Signed, and the fund has non-zero raise.
 */
export function poke(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.poke, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "poke" } }
}

/**
 * Contribute your entire balance to a crowd sale. This will transfer the entire balance of a user over to fund a parachain
 * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
 */
export function contributeAll(
  value: Omit<types.polkadot_runtime_common.crowdloan.pallet.Call.contributeAll, "type">,
) {
  return { type: "Crowdloan", value: { ...value, type: "contributeAll" } }
}

/** `PalletId` for the crowdloan pallet. An appropriate value could be `PalletId(*b"py/cfund")` */
export const PalletId: types.frame_support.PalletId = codecs.$555.decode(
  C.hex.decode("70792f6366756e64" as C.Hex),
)

/**
 *  The minimum amount that may be contributed into a crowdloan. Should almost certainly be at
 *  least `ExistentialDeposit`.
 */
export const MinContribution: types.u128 = codecs.$6.decode(
  C.hex.decode("00743ba40b0000000000000000000000" as C.Hex),
)

/** Max number of storage keys to remove per extrinsic call. */
export const RemoveKeysLimit: types.u32 = codecs.$4.decode(C.hex.decode("e8030000" as C.Hex))
