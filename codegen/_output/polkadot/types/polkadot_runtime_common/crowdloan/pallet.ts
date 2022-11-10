import { $, C } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export const $call: $.Codec<t.types.polkadot_runtime_common.crowdloan.pallet.Call> = _codec.$415

export const $error: $.Codec<t.types.polkadot_runtime_common.crowdloan.pallet.Error> = _codec.$712

export const $event: $.Codec<t.types.polkadot_runtime_common.crowdloan.pallet.Event> = _codec.$120

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.create
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.withdraw
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.refund
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.dissolve
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.edit
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.add_memo
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.poke
  | t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute_all
export namespace Call {
  /**
   * Create a new crowdloaning campaign for a parachain slot with the given lease period range.
   *
   * This applies a lock to your parachain configuration, ensuring that it cannot be changed
   * by the parachain manager.
   */
  export interface create {
    type: "create"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
    cap: t.Compact<t.types.u128>
    first_period: t.Compact<t.types.u32>
    last_period: t.Compact<t.types.u32>
    end: t.Compact<t.types.u32>
    verifier: t.types.sp_runtime.MultiSigner | undefined
  }
  /**
   * Contribute to a crowd sale. This will transfer some balance over to fund a parachain
   * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
   */
  export interface contribute {
    type: "contribute"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
    value: t.Compact<t.types.u128>
    signature: t.types.sp_runtime.MultiSignature | undefined
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
  export interface withdraw {
    type: "withdraw"
    who: t.types.sp_core.crypto.AccountId32
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
  }
  /**
   * Automatically refund contributors of an ended crowdloan.
   * Due to weight restrictions, this function may need to be called multiple
   * times to fully refund all users. We will refund `RemoveKeysLimit` users at a time.
   *
   * Origin must be signed, but can come from anyone.
   */
  export interface refund {
    type: "refund"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
  }
  /** Remove a fund after the retirement period has ended and all funds have been returned. */
  export interface dissolve {
    type: "dissolve"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
  }
  /**
   * Edit the configuration for an in-progress crowdloan.
   *
   * Can only be called by Root origin.
   */
  export interface edit {
    type: "edit"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
    cap: t.Compact<t.types.u128>
    first_period: t.Compact<t.types.u32>
    last_period: t.Compact<t.types.u32>
    end: t.Compact<t.types.u32>
    verifier: t.types.sp_runtime.MultiSigner | undefined
  }
  /**
   * Add an optional memo to an existing crowdloan contribution.
   *
   * Origin must be Signed, and the user must have contributed to the crowdloan.
   */
  export interface add_memo {
    type: "add_memo"
    index: t.types.polkadot_parachain.primitives.Id
    memo: Uint8Array
  }
  /**
   * Poke the fund into `NewRaise`
   *
   * Origin must be Signed, and the fund has non-zero raise.
   */
  export interface poke {
    type: "poke"
    index: t.types.polkadot_parachain.primitives.Id
  }
  /**
   * Contribute your entire balance to a crowd sale. This will transfer the entire balance of a user over to fund a parachain
   * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
   */
  export interface contribute_all {
    type: "contribute_all"
    index: t.Compact<t.types.polkadot_parachain.primitives.Id>
    signature: t.types.sp_runtime.MultiSignature | undefined
  }
  /**
   * Create a new crowdloaning campaign for a parachain slot with the given lease period range.
   *
   * This applies a lock to your parachain configuration, ensuring that it cannot be changed
   * by the parachain manager.
   */
  export function create(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.create, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.create {
    return { type: "create", ...value }
  }
  /**
   * Contribute to a crowd sale. This will transfer some balance over to fund a parachain
   * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
   */
  export function contribute(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute {
    return { type: "contribute", ...value }
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
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.withdraw, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.withdraw {
    return { type: "withdraw", ...value }
  }
  /**
   * Automatically refund contributors of an ended crowdloan.
   * Due to weight restrictions, this function may need to be called multiple
   * times to fully refund all users. We will refund `RemoveKeysLimit` users at a time.
   *
   * Origin must be signed, but can come from anyone.
   */
  export function refund(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.refund, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.refund {
    return { type: "refund", ...value }
  }
  /** Remove a fund after the retirement period has ended and all funds have been returned. */
  export function dissolve(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.dissolve, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.dissolve {
    return { type: "dissolve", ...value }
  }
  /**
   * Edit the configuration for an in-progress crowdloan.
   *
   * Can only be called by Root origin.
   */
  export function edit(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.edit, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.edit {
    return { type: "edit", ...value }
  }
  /**
   * Add an optional memo to an existing crowdloan contribution.
   *
   * Origin must be Signed, and the user must have contributed to the crowdloan.
   */
  export function add_memo(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.add_memo, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.add_memo {
    return { type: "add_memo", ...value }
  }
  /**
   * Poke the fund into `NewRaise`
   *
   * Origin must be Signed, and the fund has non-zero raise.
   */
  export function poke(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.poke, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.poke {
    return { type: "poke", ...value }
  }
  /**
   * Contribute your entire balance to a crowd sale. This will transfer the entire balance of a user over to fund a parachain
   * slot. It will be withdrawable when the crowdloan has ended and the funds are unused.
   */
  export function contribute_all(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute_all, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Call.contribute_all {
    return { type: "contribute_all", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "FirstPeriodInPast"
  | "FirstPeriodTooFarInFuture"
  | "LastPeriodBeforeFirstPeriod"
  | "LastPeriodTooFarInFuture"
  | "CannotEndInPast"
  | "EndTooFarInFuture"
  | "Overflow"
  | "ContributionTooSmall"
  | "InvalidParaId"
  | "CapExceeded"
  | "ContributionPeriodOver"
  | "InvalidOrigin"
  | "NotParachain"
  | "LeaseActive"
  | "BidOrLeaseActive"
  | "FundNotEnded"
  | "NoContributions"
  | "NotReadyToDissolve"
  | "InvalidSignature"
  | "MemoTooLarge"
  | "AlreadyInNewRaise"
  | "VrfDelayInProgress"
  | "NoLeasePeriod"

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.Created
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.Contributed
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.Withdrew
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.PartiallyRefunded
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.AllRefunded
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.Dissolved
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.HandleBidResult
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.Edited
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.MemoUpdated
  | t.types.polkadot_runtime_common.crowdloan.pallet.Event.AddedToNewRaise
export namespace Event {
  /** Create a new crowdloaning campaign. */
  export interface Created {
    type: "Created"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** Contributed to a crowd sale. */
  export interface Contributed {
    type: "Contributed"
    who: t.types.sp_core.crypto.AccountId32
    fund_index: t.types.polkadot_parachain.primitives.Id
    amount: t.types.u128
  }
  /** Withdrew full balance of a contributor. */
  export interface Withdrew {
    type: "Withdrew"
    who: t.types.sp_core.crypto.AccountId32
    fund_index: t.types.polkadot_parachain.primitives.Id
    amount: t.types.u128
  }
  /**
   * The loans in a fund have been partially dissolved, i.e. there are some left
   * over child keys that still need to be killed.
   */
  export interface PartiallyRefunded {
    type: "PartiallyRefunded"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** All loans in a fund have been refunded. */
  export interface AllRefunded {
    type: "AllRefunded"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** Fund is dissolved. */
  export interface Dissolved {
    type: "Dissolved"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** The result of trying to submit a new bid to the Slots pallet. */
  export interface HandleBidResult {
    type: "HandleBidResult"
    para_id: t.types.polkadot_parachain.primitives.Id
    result: null | C.ChainError<t.types.sp_runtime.DispatchError>
  }
  /** The configuration to a crowdloan has been edited. */
  export interface Edited {
    type: "Edited"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** A memo has been updated. */
  export interface MemoUpdated {
    type: "MemoUpdated"
    who: t.types.sp_core.crypto.AccountId32
    para_id: t.types.polkadot_parachain.primitives.Id
    memo: Uint8Array
  }
  /** A parachain has been moved to `NewRaise` */
  export interface AddedToNewRaise {
    type: "AddedToNewRaise"
    para_id: t.types.polkadot_parachain.primitives.Id
  }
  /** Create a new crowdloaning campaign. */
  export function Created(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.Created, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.Created {
    return { type: "Created", ...value }
  }
  /** Contributed to a crowd sale. */
  export function Contributed(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.Contributed, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.Contributed {
    return { type: "Contributed", ...value }
  }
  /** Withdrew full balance of a contributor. */
  export function Withdrew(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.Withdrew, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.Withdrew {
    return { type: "Withdrew", ...value }
  }
  /**
   * The loans in a fund have been partially dissolved, i.e. there are some left
   * over child keys that still need to be killed.
   */
  export function PartiallyRefunded(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.PartiallyRefunded, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.PartiallyRefunded {
    return { type: "PartiallyRefunded", ...value }
  }
  /** All loans in a fund have been refunded. */
  export function AllRefunded(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.AllRefunded, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.AllRefunded {
    return { type: "AllRefunded", ...value }
  }
  /** Fund is dissolved. */
  export function Dissolved(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.Dissolved, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.Dissolved {
    return { type: "Dissolved", ...value }
  }
  /** The result of trying to submit a new bid to the Slots pallet. */
  export function HandleBidResult(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.HandleBidResult, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.HandleBidResult {
    return { type: "HandleBidResult", ...value }
  }
  /** The configuration to a crowdloan has been edited. */
  export function Edited(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.Edited, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.Edited {
    return { type: "Edited", ...value }
  }
  /** A memo has been updated. */
  export function MemoUpdated(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.MemoUpdated, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.MemoUpdated {
    return { type: "MemoUpdated", ...value }
  }
  /** A parachain has been moved to `NewRaise` */
  export function AddedToNewRaise(
    value: Omit<t.types.polkadot_runtime_common.crowdloan.pallet.Event.AddedToNewRaise, "type">,
  ): t.types.polkadot_runtime_common.crowdloan.pallet.Event.AddedToNewRaise {
    return { type: "AddedToNewRaise", ...value }
  }
}
