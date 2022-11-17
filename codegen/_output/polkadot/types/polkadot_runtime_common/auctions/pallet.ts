import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.polkadot_runtime_common.auctions.pallet.Call.newAuction
  | types.polkadot_runtime_common.auctions.pallet.Call.bid
  | types.polkadot_runtime_common.auctions.pallet.Call.cancelAuction
export namespace Call {
  /**
   * Create a new auction.
   *
   * This can only happen when there isn't already an auction in progress and may only be
   * called by the root origin. Accepts the `duration` of this auction and the
   * `lease_period_index` of the initial lease period of the four that are to be auctioned.
   */
  export interface newAuction {
    type: "newAuction"
    duration: types.Compact<types.u32>
    leasePeriodIndex: types.Compact<types.u32>
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
    para: types.Compact<types.polkadot_parachain.primitives.Id>
    auctionIndex: types.Compact<types.u32>
    firstSlot: types.Compact<types.u32>
    lastSlot: types.Compact<types.u32>
    amount: types.Compact<types.u128>
  }
  /**
   * Cancel an in-progress auction.
   *
   * Can only be called by Root origin.
   */
  export interface cancelAuction {
    type: "cancelAuction"
  }
  /**
   * Create a new auction.
   *
   * This can only happen when there isn't already an auction in progress and may only be
   * called by the root origin. Accepts the `duration` of this auction and the
   * `lease_period_index` of the initial lease period of the four that are to be auctioned.
   */
  export function newAuction(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Call.newAuction, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Call.newAuction {
    return { type: "newAuction", ...value }
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
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Call.bid, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Call.bid {
    return { type: "bid", ...value }
  }
  /**
   * Cancel an in-progress auction.
   *
   * Can only be called by Root origin.
   */
  export function cancelAuction(): types.polkadot_runtime_common.auctions.pallet.Call.cancelAuction {
    return { type: "cancelAuction" }
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
  | types.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted
  | types.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed
  | types.polkadot_runtime_common.auctions.pallet.Event.Reserved
  | types.polkadot_runtime_common.auctions.pallet.Event.Unreserved
  | types.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated
  | types.polkadot_runtime_common.auctions.pallet.Event.BidAccepted
  | types.polkadot_runtime_common.auctions.pallet.Event.WinningOffset
export namespace Event {
  /**
   * An auction started. Provides its index and the block number where it will begin to
   * close and the first lease period of the quadruplet that is auctioned.
   */
  export interface AuctionStarted {
    type: "AuctionStarted"
    auctionIndex: types.u32
    leasePeriod: types.u32
    ending: types.u32
  }
  /** An auction ended. All funds become unreserved. */
  export interface AuctionClosed {
    type: "AuctionClosed"
    auctionIndex: types.u32
  }
  /**
   * Funds were reserved for a winning bid. First balance is the extra amount reserved.
   * Second is the total.
   */
  export interface Reserved {
    type: "Reserved"
    bidder: types.sp_core.crypto.AccountId32
    extraReserved: types.u128
    totalAmount: types.u128
  }
  /** Funds were unreserved since bidder is no longer active. `[bidder, amount]` */
  export interface Unreserved {
    type: "Unreserved"
    bidder: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /**
   * Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   * but no parachain slot has been leased.
   */
  export interface ReserveConfiscated {
    type: "ReserveConfiscated"
    paraId: types.polkadot_parachain.primitives.Id
    leaser: types.sp_core.crypto.AccountId32
    amount: types.u128
  }
  /** A new bid has been accepted as the current winner. */
  export interface BidAccepted {
    type: "BidAccepted"
    bidder: types.sp_core.crypto.AccountId32
    paraId: types.polkadot_parachain.primitives.Id
    amount: types.u128
    firstSlot: types.u32
    lastSlot: types.u32
  }
  /** The winning offset was chosen for an auction. This will map into the `Winning` storage map. */
  export interface WinningOffset {
    type: "WinningOffset"
    auctionIndex: types.u32
    blockNumber: types.u32
  }
  /**
   * An auction started. Provides its index and the block number where it will begin to
   * close and the first lease period of the quadruplet that is auctioned.
   */
  export function AuctionStarted(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.AuctionStarted {
    return { type: "AuctionStarted", ...value }
  }
  /** An auction ended. All funds become unreserved. */
  export function AuctionClosed(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.AuctionClosed {
    return { type: "AuctionClosed", ...value }
  }
  /**
   * Funds were reserved for a winning bid. First balance is the extra amount reserved.
   * Second is the total.
   */
  export function Reserved(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.Reserved, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.Reserved {
    return { type: "Reserved", ...value }
  }
  /** Funds were unreserved since bidder is no longer active. `[bidder, amount]` */
  export function Unreserved(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.Unreserved, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.Unreserved {
    return { type: "Unreserved", ...value }
  }
  /**
   * Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   * but no parachain slot has been leased.
   */
  export function ReserveConfiscated(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.ReserveConfiscated {
    return { type: "ReserveConfiscated", ...value }
  }
  /** A new bid has been accepted as the current winner. */
  export function BidAccepted(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.BidAccepted, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.BidAccepted {
    return { type: "BidAccepted", ...value }
  }
  /** The winning offset was chosen for an auction. This will map into the `Winning` storage map. */
  export function WinningOffset(
    value: Omit<types.polkadot_runtime_common.auctions.pallet.Event.WinningOffset, "type">,
  ): types.polkadot_runtime_common.auctions.pallet.Event.WinningOffset {
    return { type: "WinningOffset", ...value }
  }
}
