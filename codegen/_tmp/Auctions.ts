import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Number of auctions started so far. */
export const AuctionCounter = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Auctions",
  "AuctionCounter",
  $.tuple(),
  codecs.$4,
)

/**
 *  Information relating to the current auction, if there is one.
 *
 *  The first item in the tuple is the lease period index that the first of the four
 *  contiguous lease periods on auction is for. The second is the block number when the
 *  auction will "begin to end", i.e. the first block of the Ending Period of the auction.
 */
export const AuctionInfo = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Auctions",
  "AuctionInfo",
  $.tuple(),
  codecs.$29,
)

/**
 *  Amounts currently reserved in the accounts of the bidders currently winning
 *  (sub-)ranges.
 */
export const ReservedAmounts = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Auctions",
  "ReservedAmounts",
  $.tuple(codecs.$697),
  codecs.$6,
)

/**
 *  The winning bids for each of the 10 ranges at each sample in the final Ending Period of
 *  the current auction. The map's key is the 0-based index into the Sample Size. The
 *  first sample of the ending period is 0; the last is `Sample Size - 1`.
 */
export const Winning = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Auctions",
  "Winning",
  $.tuple(codecs.$4),
  codecs.$698,
)

/**
 * Create a new auction.
 *
 * This can only happen when there isn't already an auction in progress and may only be
 * called by the root origin. Accepts the `duration` of this auction and the
 * `lease_period_index` of the initial lease period of the four that are to be auctioned.
 */
export function newAuction(
  value: Omit<types.polkadot_runtime_common.auctions.pallet.Call.newAuction, "type">,
) {
  return { type: "Auctions", value: { ...value, type: "newAuction" } }
}

/**
 * Make a new bid from an account (including a parachain account) for deploying a new
 * parachain.
 *
 * Multiple simultaneous bids from the same bidder are allowed only as long as all active
 * bids overlap each other (i.e. are mutually exclusive). Bids cannot be redacted.
 *
 * - `sub` is the sub-bidder ID, allowing for multiple competing bids to be made by (and
 * funded by) the same account.
 * - `auction_index` is the index of the auction to bid on. Should just be the present
 * value of `AuctionCounter`.
 * - `first_slot` is the first lease period index of the range to bid on. This is the
 * absolute lease period index value, not an auction-specific offset.
 * - `last_slot` is the last lease period index of the range to bid on. This is the
 * absolute lease period index value, not an auction-specific offset.
 * - `amount` is the amount to bid to be held as deposit for the parachain should the
 * bid win. This amount is held throughout the range.
 */
export function bid(value: Omit<types.polkadot_runtime_common.auctions.pallet.Call.bid, "type">) {
  return { type: "Auctions", value: { ...value, type: "bid" } }
}

/**
 * Cancel an in-progress auction.
 *
 * Can only be called by Root origin.
 */
export function cancelAuction() {
  return { type: "Auctions", value: { type: "cancelAuction" } }
}

/** The number of blocks over which an auction may be retroactively ended. */
export const EndingPeriod: types.u32 = codecs.$4.decode(C.hex.decode("40190100" as C.Hex))

/**
 *  The length of each sample to take during the ending period.
 *
 *  `EndingPeriod` / `SampleLength` = Total # of Samples
 */
export const SampleLength: types.u32 = codecs.$4.decode(C.hex.decode("14000000" as C.Hex))

export const SlotRangeCount: types.u32 = codecs.$4.decode(C.hex.decode("24000000" as C.Hex))

export const LeasePeriodsPerSlot: types.u32 = codecs.$4.decode(C.hex.decode("08000000" as C.Hex))
