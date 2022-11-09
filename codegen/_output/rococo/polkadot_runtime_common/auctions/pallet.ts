import { $, BitSequence, ChainError, Era } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"
export const $call: $.Codec<t.polkadot_runtime_common.auctions.pallet.Call> = _codec.$413

export const $error: $.Codec<t.polkadot_runtime_common.auctions.pallet.Error> = _codec.$709

export const $event: $.Codec<t.polkadot_runtime_common.auctions.pallet.Event> = _codec.$119

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.polkadot_runtime_common.auctions.pallet.Call.new_auction
  | t.polkadot_runtime_common.auctions.pallet.Call.bid
  | t.polkadot_runtime_common.auctions.pallet.Call.cancel_auction
export namespace Call {
  /**
   * Create a new auction.
   *
   * This can only happen when there isn't already an auction in progress and may only be
   * called by the root origin. Accepts the `duration` of this auction and the
   * `lease_period_index` of the initial lease period of the four that are to be auctioned.
   */
  export interface new_auction {
    type: "new_auction"
    duration: t.Compact<t.u32>
    lease_period_index: t.Compact<t.u32>
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
  export interface bid {
    type: "bid"
    para: t.Compact<t.polkadot_parachain.primitives.Id>
    auction_index: t.Compact<t.u32>
    first_slot: t.Compact<t.u32>
    last_slot: t.Compact<t.u32>
    amount: t.Compact<t.u128>
  }
  /**
   * Cancel an in-progress auction.
   *
   * Can only be called by Root origin.
   */
  export interface cancel_auction {
    type: "cancel_auction"
  }
  /**
   * Create a new auction.
   *
   * This can only happen when there isn't already an auction in progress and may only be
   * called by the root origin. Accepts the `duration` of this auction and the
   * `lease_period_index` of the initial lease period of the four that are to be auctioned.
   */
  export function new_auction(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Call.new_auction, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Call.new_auction {
    return { type: "new_auction", ...value }
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
  export function bid(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Call.bid, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Call.bid {
    return { type: "bid", ...value }
  }
  /**
   * Cancel an in-progress auction.
   *
   * Can only be called by Root origin.
   */
  export function cancel_auction(): t.polkadot_runtime_common.auctions.pallet.Call.cancel_auction {
    return { type: "cancel_auction" }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "AuctionInProgress"
  | "LeasePeriodInPast"
  | "ParaNotRegistered"
  | "NotCurrentAuction"
  | "NotAuction"
  | "AuctionEnded"
  | "AlreadyLeasedOut"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted
  | t.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed
  | t.polkadot_runtime_common.auctions.pallet.Event.Reserved
  | t.polkadot_runtime_common.auctions.pallet.Event.Unreserved
  | t.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated
  | t.polkadot_runtime_common.auctions.pallet.Event.BidAccepted
  | t.polkadot_runtime_common.auctions.pallet.Event.WinningOffset
export namespace Event {
  /**
   * An auction started. Provides its index and the block number where it will begin to
   * close and the first lease period of the quadruplet that is auctioned.
   */
  export interface AuctionStarted {
    type: "AuctionStarted"
    auction_index: t.u32
    lease_period: t.u32
    ending: t.u32
  }
  /** An auction ended. All funds become unreserved. */
  export interface AuctionClosed {
    type: "AuctionClosed"
    auction_index: t.u32
  }
  /**
   * Funds were reserved for a winning bid. First balance is the extra amount reserved.
   * Second is the total.
   */
  export interface Reserved {
    type: "Reserved"
    bidder: t.sp_core.crypto.AccountId32
    extra_reserved: t.u128
    total_amount: t.u128
  }
  /** Funds were unreserved since bidder is no longer active. `[bidder, amount]` */
  export interface Unreserved {
    type: "Unreserved"
    bidder: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /**
   * Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   * but no parachain slot has been leased.
   */
  export interface ReserveConfiscated {
    type: "ReserveConfiscated"
    para_id: t.polkadot_parachain.primitives.Id
    leaser: t.sp_core.crypto.AccountId32
    amount: t.u128
  }
  /** A new bid has been accepted as the current winner. */
  export interface BidAccepted {
    type: "BidAccepted"
    bidder: t.sp_core.crypto.AccountId32
    para_id: t.polkadot_parachain.primitives.Id
    amount: t.u128
    first_slot: t.u32
    last_slot: t.u32
  }
  /** The winning offset was chosen for an auction. This will map into the `Winning` storage map. */
  export interface WinningOffset {
    type: "WinningOffset"
    auction_index: t.u32
    block_number: t.u32
  }
  /**
   * An auction started. Provides its index and the block number where it will begin to
   * close and the first lease period of the quadruplet that is auctioned.
   */
  export function AuctionStarted(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted {
    return { type: "AuctionStarted", ...value }
  }
  /** An auction ended. All funds become unreserved. */
  export function AuctionClosed(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed {
    return { type: "AuctionClosed", ...value }
  }
  /**
   * Funds were reserved for a winning bid. First balance is the extra amount reserved.
   * Second is the total.
   */
  export function Reserved(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.Reserved, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.Reserved {
    return { type: "Reserved", ...value }
  }
  /** Funds were unreserved since bidder is no longer active. `[bidder, amount]` */
  export function Unreserved(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.Unreserved, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.Unreserved {
    return { type: "Unreserved", ...value }
  }
  /**
   * Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   * but no parachain slot has been leased.
   */
  export function ReserveConfiscated(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated {
    return { type: "ReserveConfiscated", ...value }
  }
  /** A new bid has been accepted as the current winner. */
  export function BidAccepted(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.BidAccepted, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.BidAccepted {
    return { type: "BidAccepted", ...value }
  }
  /** The winning offset was chosen for an auction. This will map into the `Winning` storage map. */
  export function WinningOffset(
    value: Omit<t.polkadot_runtime_common.auctions.pallet.Event.WinningOffset, "type">,
  ): t.polkadot_runtime_common.auctions.pallet.Event.WinningOffset {
    return { type: "WinningOffset", ...value }
  }
}
