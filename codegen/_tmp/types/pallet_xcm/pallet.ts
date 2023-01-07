import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_xcm.pallet.Call> = codecs.$422
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_xcm.pallet.Call.send
  | types.pallet_xcm.pallet.Call.teleportAssets
  | types.pallet_xcm.pallet.Call.reserveTransferAssets
  | types.pallet_xcm.pallet.Call.execute
  | types.pallet_xcm.pallet.Call.forceXcmVersion
  | types.pallet_xcm.pallet.Call.forceDefaultXcmVersion
  | types.pallet_xcm.pallet.Call.forceSubscribeVersionNotify
  | types.pallet_xcm.pallet.Call.forceUnsubscribeVersionNotify
  | types.pallet_xcm.pallet.Call.limitedReserveTransferAssets
  | types.pallet_xcm.pallet.Call.limitedTeleportAssets
export namespace Call {
  export interface send {
    type: "send"
    dest: types.xcm.VersionedMultiLocation
    message: types.xcm.VersionedXcm
  }
  /**
   * Teleport some assets from the local chain to some destination chain.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
   * with all fees taken as needed from the asset.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  export interface teleportAssets {
    type: "teleportAssets"
    dest: types.xcm.VersionedMultiLocation
    beneficiary: types.xcm.VersionedMultiLocation
    assets: types.xcm.VersionedMultiAssets
    feeAssetItem: types.u32
  }
  /**
   * Transfer some assets from the local chain to the sovereign account of a destination
   * chain and forward a notification XCM.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
   * with all fees taken as needed from the asset.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  export interface reserveTransferAssets {
    type: "reserveTransferAssets"
    dest: types.xcm.VersionedMultiLocation
    beneficiary: types.xcm.VersionedMultiLocation
    assets: types.xcm.VersionedMultiAssets
    feeAssetItem: types.u32
  }
  /**
   * Execute an XCM message from a local, signed, origin.
   *
   * An event is deposited indicating whether `msg` could be executed completely or only
   * partially.
   *
   * No more than `max_weight` will be used in its attempted execution. If this is less than the
   * maximum amount of weight that the message could take to be executed, then no execution
   * attempt will be made.
   *
   * NOTE: A successful return to this does *not* imply that the `msg` was executed successfully
   * to completion; only that *some* of it was executed.
   */
  export interface execute {
    type: "execute"
    message: types.xcm.VersionedXcm
    maxWeight: types.frame_support.weights.weight_v2.Weight
  }
  /**
   * Extoll that a particular destination can be communicated with through a particular
   * version of XCM.
   *
   * - `origin`: Must be Root.
   * - `location`: The destination that is being described.
   * - `xcm_version`: The latest version of XCM that `location` supports.
   */
  export interface forceXcmVersion {
    type: "forceXcmVersion"
    location: types.xcm.v1.multilocation.MultiLocation
    xcmVersion: types.u32
  }
  /**
   * Set a safe XCM version (the version that XCM should be encoded with if the most recent
   * version a destination can accept is unknown).
   *
   * - `origin`: Must be Root.
   * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
   */
  export interface forceDefaultXcmVersion {
    type: "forceDefaultXcmVersion"
    maybeXcmVersion: types.u32 | undefined
  }
  /**
   * Ask a location to notify us regarding their XCM version and any changes to it.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we should subscribe for XCM version notifications.
   */
  export interface forceSubscribeVersionNotify {
    type: "forceSubscribeVersionNotify"
    location: types.xcm.VersionedMultiLocation
  }
  /**
   * Require that a particular destination should no longer notify us regarding any XCM
   * version changes.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we are currently subscribed for XCM version
   *   notifications which we no longer desire.
   */
  export interface forceUnsubscribeVersionNotify {
    type: "forceUnsubscribeVersionNotify"
    location: types.xcm.VersionedMultiLocation
  }
  /**
   * Transfer some assets from the local chain to the sovereign account of a destination
   * chain and forward a notification XCM.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
   * is needed than `weight_limit`, then the operation will fail and the assets send may be
   * at risk.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  export interface limitedReserveTransferAssets {
    type: "limitedReserveTransferAssets"
    dest: types.xcm.VersionedMultiLocation
    beneficiary: types.xcm.VersionedMultiLocation
    assets: types.xcm.VersionedMultiAssets
    feeAssetItem: types.u32
    weightLimit: types.xcm.v2.WeightLimit
  }
  /**
   * Teleport some assets from the local chain to some destination chain.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
   * is needed than `weight_limit`, then the operation will fail and the assets send may be
   * at risk.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  export interface limitedTeleportAssets {
    type: "limitedTeleportAssets"
    dest: types.xcm.VersionedMultiLocation
    beneficiary: types.xcm.VersionedMultiLocation
    assets: types.xcm.VersionedMultiAssets
    feeAssetItem: types.u32
    weightLimit: types.xcm.v2.WeightLimit
  }
  export function send(
    value: Omit<types.pallet_xcm.pallet.Call.send, "type">,
  ): types.pallet_xcm.pallet.Call.send {
    return { type: "send", ...value }
  }
  /**
   * Teleport some assets from the local chain to some destination chain.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
   * with all fees taken as needed from the asset.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  export function teleportAssets(
    value: Omit<types.pallet_xcm.pallet.Call.teleportAssets, "type">,
  ): types.pallet_xcm.pallet.Call.teleportAssets {
    return { type: "teleportAssets", ...value }
  }
  /**
   * Transfer some assets from the local chain to the sovereign account of a destination
   * chain and forward a notification XCM.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
   * with all fees taken as needed from the asset.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   */
  export function reserveTransferAssets(
    value: Omit<types.pallet_xcm.pallet.Call.reserveTransferAssets, "type">,
  ): types.pallet_xcm.pallet.Call.reserveTransferAssets {
    return { type: "reserveTransferAssets", ...value }
  }
  /**
   * Execute an XCM message from a local, signed, origin.
   *
   * An event is deposited indicating whether `msg` could be executed completely or only
   * partially.
   *
   * No more than `max_weight` will be used in its attempted execution. If this is less than the
   * maximum amount of weight that the message could take to be executed, then no execution
   * attempt will be made.
   *
   * NOTE: A successful return to this does *not* imply that the `msg` was executed successfully
   * to completion; only that *some* of it was executed.
   */
  export function execute(
    value: Omit<types.pallet_xcm.pallet.Call.execute, "type">,
  ): types.pallet_xcm.pallet.Call.execute {
    return { type: "execute", ...value }
  }
  /**
   * Extoll that a particular destination can be communicated with through a particular
   * version of XCM.
   *
   * - `origin`: Must be Root.
   * - `location`: The destination that is being described.
   * - `xcm_version`: The latest version of XCM that `location` supports.
   */
  export function forceXcmVersion(
    value: Omit<types.pallet_xcm.pallet.Call.forceXcmVersion, "type">,
  ): types.pallet_xcm.pallet.Call.forceXcmVersion {
    return { type: "forceXcmVersion", ...value }
  }
  /**
   * Set a safe XCM version (the version that XCM should be encoded with if the most recent
   * version a destination can accept is unknown).
   *
   * - `origin`: Must be Root.
   * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
   */
  export function forceDefaultXcmVersion(
    value: Omit<types.pallet_xcm.pallet.Call.forceDefaultXcmVersion, "type">,
  ): types.pallet_xcm.pallet.Call.forceDefaultXcmVersion {
    return { type: "forceDefaultXcmVersion", ...value }
  }
  /**
   * Ask a location to notify us regarding their XCM version and any changes to it.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we should subscribe for XCM version notifications.
   */
  export function forceSubscribeVersionNotify(
    value: Omit<types.pallet_xcm.pallet.Call.forceSubscribeVersionNotify, "type">,
  ): types.pallet_xcm.pallet.Call.forceSubscribeVersionNotify {
    return { type: "forceSubscribeVersionNotify", ...value }
  }
  /**
   * Require that a particular destination should no longer notify us regarding any XCM
   * version changes.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we are currently subscribed for XCM version
   *   notifications which we no longer desire.
   */
  export function forceUnsubscribeVersionNotify(
    value: Omit<types.pallet_xcm.pallet.Call.forceUnsubscribeVersionNotify, "type">,
  ): types.pallet_xcm.pallet.Call.forceUnsubscribeVersionNotify {
    return { type: "forceUnsubscribeVersionNotify", ...value }
  }
  /**
   * Transfer some assets from the local chain to the sovereign account of a destination
   * chain and forward a notification XCM.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
   * is needed than `weight_limit`, then the operation will fail and the assets send may be
   * at risk.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. This should include the assets used to pay the fee on the
   *   `dest` side.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  export function limitedReserveTransferAssets(
    value: Omit<types.pallet_xcm.pallet.Call.limitedReserveTransferAssets, "type">,
  ): types.pallet_xcm.pallet.Call.limitedReserveTransferAssets {
    return { type: "limitedReserveTransferAssets", ...value }
  }
  /**
   * Teleport some assets from the local chain to some destination chain.
   *
   * Fee payment on the destination side is made from the asset in the `assets` vector of
   * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
   * is needed than `weight_limit`, then the operation will fail and the assets send may be
   * at risk.
   *
   * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
   * - `dest`: Destination context for the assets. Will typically be `X2(Parent, Parachain(..))` to send
   *   from parachain to parachain, or `X1(Parachain(..))` to send from relay to parachain.
   * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will generally be
   *   an `AccountId32` value.
   * - `assets`: The assets to be withdrawn. The first item should be the currency used to to pay the fee on the
   *   `dest` side. May not be empty.
   * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
   *   fees.
   * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
   */
  export function limitedTeleportAssets(
    value: Omit<types.pallet_xcm.pallet.Call.limitedTeleportAssets, "type">,
  ): types.pallet_xcm.pallet.Call.limitedTeleportAssets {
    return { type: "limitedTeleportAssets", ...value }
  }
}

export const $error: $.Codec<types.pallet_xcm.pallet.Error> = codecs.$715
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "Unreachable"
  | "SendFailure"
  | "Filtered"
  | "UnweighableMessage"
  | "DestinationNotInvertible"
  | "Empty"
  | "CannotReanchor"
  | "TooManyAssets"
  | "InvalidOrigin"
  | "BadVersion"
  | "BadLocation"
  | "NoSubscription"
  | "AlreadySubscribed"

export const $event: $.Codec<types.pallet_xcm.pallet.Event> = codecs.$120
/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */

export type Event =
  | types.pallet_xcm.pallet.Event.Attempted
  | types.pallet_xcm.pallet.Event.Sent
  | types.pallet_xcm.pallet.Event.UnexpectedResponse
  | types.pallet_xcm.pallet.Event.ResponseReady
  | types.pallet_xcm.pallet.Event.Notified
  | types.pallet_xcm.pallet.Event.NotifyOverweight
  | types.pallet_xcm.pallet.Event.NotifyDispatchError
  | types.pallet_xcm.pallet.Event.NotifyDecodeFailed
  | types.pallet_xcm.pallet.Event.InvalidResponder
  | types.pallet_xcm.pallet.Event.InvalidResponderVersion
  | types.pallet_xcm.pallet.Event.ResponseTaken
  | types.pallet_xcm.pallet.Event.AssetsTrapped
  | types.pallet_xcm.pallet.Event.VersionChangeNotified
  | types.pallet_xcm.pallet.Event.SupportedVersionChanged
  | types.pallet_xcm.pallet.Event.NotifyTargetSendFail
  | types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail
export namespace Event {
  /**
   * Execution of an XCM message was attempted.
   *
   * \[ outcome \]
   */
  export interface Attempted {
    type: "Attempted"
    value: types.xcm.v2.traits.Outcome
  }
  /**
   * A XCM message was sent.
   *
   * \[ origin, destination, message \]
   */
  export interface Sent {
    type: "Sent"
    value: [
      types.xcm.v1.multilocation.MultiLocation,
      types.xcm.v1.multilocation.MultiLocation,
      types.xcm.v2.Xcm,
    ]
  }
  /**
   * Query response received which does not match a registered query. This may be because a
   * matching query was never registered, it may be because it is a duplicate response, or
   * because the query timed out.
   *
   * \[ origin location, id \]
   */
  export interface UnexpectedResponse {
    type: "UnexpectedResponse"
    value: [types.xcm.v1.multilocation.MultiLocation, types.u64]
  }
  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   *
   * \[ id, response \]
   */
  export interface ResponseReady {
    type: "ResponseReady"
    value: [types.u64, types.xcm.v2.Response]
  }
  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   *
   * \[ id, pallet index, call index \]
   */
  export interface Notified {
    type: "Notified"
    value: [types.u64, types.u8, types.u8]
  }
  /**
   * Query response has been received and query is removed. The registered notification could
   * not be dispatched because the dispatch weight is greater than the maximum weight
   * originally budgeted by this runtime for the query result.
   *
   * \[ id, pallet index, call index, actual weight, max budgeted weight \]
   */
  export interface NotifyOverweight {
    type: "NotifyOverweight"
    value: [
      types.u64,
      types.u8,
      types.u8,
      types.frame_support.weights.weight_v2.Weight,
      types.frame_support.weights.weight_v2.Weight,
    ]
  }
  /**
   * Query response has been received and query is removed. There was a general error with
   * dispatching the notification call.
   *
   * \[ id, pallet index, call index \]
   */
  export interface NotifyDispatchError {
    type: "NotifyDispatchError"
    value: [types.u64, types.u8, types.u8]
  }
  /**
   * Query response has been received and query is removed. The dispatch was unable to be
   * decoded into a `Call`; this might be due to dispatch function having a signature which
   * is not `(origin, QueryId, Response)`.
   *
   * \[ id, pallet index, call index \]
   */
  export interface NotifyDecodeFailed {
    type: "NotifyDecodeFailed"
    value: [types.u64, types.u8, types.u8]
  }
  /**
   * Expected query response has been received but the origin location of the response does
   * not match that expected. The query remains registered for a later, valid, response to
   * be received and acted upon.
   *
   * \[ origin location, id, expected location \]
   */
  export interface InvalidResponder {
    type: "InvalidResponder"
    value: [
      types.xcm.v1.multilocation.MultiLocation,
      types.u64,
      types.xcm.v1.multilocation.MultiLocation | undefined,
    ]
  }
  /**
   * Expected query response has been received but the expected origin location placed in
   * storage by this runtime previously cannot be decoded. The query remains registered.
   *
   * This is unexpected (since a location placed in storage in a previously executing
   * runtime should be readable prior to query timeout) and dangerous since the possibly
   * valid response will be dropped. Manual governance intervention is probably going to be
   * needed.
   *
   * \[ origin location, id \]
   */
  export interface InvalidResponderVersion {
    type: "InvalidResponderVersion"
    value: [types.xcm.v1.multilocation.MultiLocation, types.u64]
  }
  /**
   * Received query response has been read and removed.
   *
   * \[ id \]
   */
  export interface ResponseTaken {
    type: "ResponseTaken"
    value: types.u64
  }
  /**
   * Some assets have been placed in an asset trap.
   *
   * \[ hash, origin, assets \]
   */
  export interface AssetsTrapped {
    type: "AssetsTrapped"
    value: [
      types.primitive_types.H256,
      types.xcm.v1.multilocation.MultiLocation,
      types.xcm.VersionedMultiAssets,
    ]
  }
  /**
   * An XCM version change notification message has been attempted to be sent.
   *
   * \[ destination, result \]
   */
  export interface VersionChangeNotified {
    type: "VersionChangeNotified"
    value: [types.xcm.v1.multilocation.MultiLocation, types.u32]
  }
  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   *
   * \[ location, XCM version \]
   */
  export interface SupportedVersionChanged {
    type: "SupportedVersionChanged"
    value: [types.xcm.v1.multilocation.MultiLocation, types.u32]
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   *
   * \[ location, query ID, error \]
   */
  export interface NotifyTargetSendFail {
    type: "NotifyTargetSendFail"
    value: [types.xcm.v1.multilocation.MultiLocation, types.u64, types.xcm.v2.traits.Error]
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   *
   * \[ location, query ID \]
   */
  export interface NotifyTargetMigrationFail {
    type: "NotifyTargetMigrationFail"
    value: [types.xcm.VersionedMultiLocation, types.u64]
  }
  /**
   * Execution of an XCM message was attempted.
   *
   * \[ outcome \]
   */
  export function Attempted(
    value: types.pallet_xcm.pallet.Event.Attempted["value"],
  ): types.pallet_xcm.pallet.Event.Attempted {
    return { type: "Attempted", value }
  }
  /**
   * A XCM message was sent.
   *
   * \[ origin, destination, message \]
   */
  export function Sent(
    ...value: types.pallet_xcm.pallet.Event.Sent["value"]
  ): types.pallet_xcm.pallet.Event.Sent {
    return { type: "Sent", value }
  }
  /**
   * Query response received which does not match a registered query. This may be because a
   * matching query was never registered, it may be because it is a duplicate response, or
   * because the query timed out.
   *
   * \[ origin location, id \]
   */
  export function UnexpectedResponse(
    ...value: types.pallet_xcm.pallet.Event.UnexpectedResponse["value"]
  ): types.pallet_xcm.pallet.Event.UnexpectedResponse {
    return { type: "UnexpectedResponse", value }
  }
  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   *
   * \[ id, response \]
   */
  export function ResponseReady(
    ...value: types.pallet_xcm.pallet.Event.ResponseReady["value"]
  ): types.pallet_xcm.pallet.Event.ResponseReady {
    return { type: "ResponseReady", value }
  }
  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   *
   * \[ id, pallet index, call index \]
   */
  export function Notified(
    ...value: types.pallet_xcm.pallet.Event.Notified["value"]
  ): types.pallet_xcm.pallet.Event.Notified {
    return { type: "Notified", value }
  }
  /**
   * Query response has been received and query is removed. The registered notification could
   * not be dispatched because the dispatch weight is greater than the maximum weight
   * originally budgeted by this runtime for the query result.
   *
   * \[ id, pallet index, call index, actual weight, max budgeted weight \]
   */
  export function NotifyOverweight(
    ...value: types.pallet_xcm.pallet.Event.NotifyOverweight["value"]
  ): types.pallet_xcm.pallet.Event.NotifyOverweight {
    return { type: "NotifyOverweight", value }
  }
  /**
   * Query response has been received and query is removed. There was a general error with
   * dispatching the notification call.
   *
   * \[ id, pallet index, call index \]
   */
  export function NotifyDispatchError(
    ...value: types.pallet_xcm.pallet.Event.NotifyDispatchError["value"]
  ): types.pallet_xcm.pallet.Event.NotifyDispatchError {
    return { type: "NotifyDispatchError", value }
  }
  /**
   * Query response has been received and query is removed. The dispatch was unable to be
   * decoded into a `Call`; this might be due to dispatch function having a signature which
   * is not `(origin, QueryId, Response)`.
   *
   * \[ id, pallet index, call index \]
   */
  export function NotifyDecodeFailed(
    ...value: types.pallet_xcm.pallet.Event.NotifyDecodeFailed["value"]
  ): types.pallet_xcm.pallet.Event.NotifyDecodeFailed {
    return { type: "NotifyDecodeFailed", value }
  }
  /**
   * Expected query response has been received but the origin location of the response does
   * not match that expected. The query remains registered for a later, valid, response to
   * be received and acted upon.
   *
   * \[ origin location, id, expected location \]
   */
  export function InvalidResponder(
    ...value: types.pallet_xcm.pallet.Event.InvalidResponder["value"]
  ): types.pallet_xcm.pallet.Event.InvalidResponder {
    return { type: "InvalidResponder", value }
  }
  /**
   * Expected query response has been received but the expected origin location placed in
   * storage by this runtime previously cannot be decoded. The query remains registered.
   *
   * This is unexpected (since a location placed in storage in a previously executing
   * runtime should be readable prior to query timeout) and dangerous since the possibly
   * valid response will be dropped. Manual governance intervention is probably going to be
   * needed.
   *
   * \[ origin location, id \]
   */
  export function InvalidResponderVersion(
    ...value: types.pallet_xcm.pallet.Event.InvalidResponderVersion["value"]
  ): types.pallet_xcm.pallet.Event.InvalidResponderVersion {
    return { type: "InvalidResponderVersion", value }
  }
  /**
   * Received query response has been read and removed.
   *
   * \[ id \]
   */
  export function ResponseTaken(
    value: types.pallet_xcm.pallet.Event.ResponseTaken["value"],
  ): types.pallet_xcm.pallet.Event.ResponseTaken {
    return { type: "ResponseTaken", value }
  }
  /**
   * Some assets have been placed in an asset trap.
   *
   * \[ hash, origin, assets \]
   */
  export function AssetsTrapped(
    ...value: types.pallet_xcm.pallet.Event.AssetsTrapped["value"]
  ): types.pallet_xcm.pallet.Event.AssetsTrapped {
    return { type: "AssetsTrapped", value }
  }
  /**
   * An XCM version change notification message has been attempted to be sent.
   *
   * \[ destination, result \]
   */
  export function VersionChangeNotified(
    ...value: types.pallet_xcm.pallet.Event.VersionChangeNotified["value"]
  ): types.pallet_xcm.pallet.Event.VersionChangeNotified {
    return { type: "VersionChangeNotified", value }
  }
  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   *
   * \[ location, XCM version \]
   */
  export function SupportedVersionChanged(
    ...value: types.pallet_xcm.pallet.Event.SupportedVersionChanged["value"]
  ): types.pallet_xcm.pallet.Event.SupportedVersionChanged {
    return { type: "SupportedVersionChanged", value }
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   *
   * \[ location, query ID, error \]
   */
  export function NotifyTargetSendFail(
    ...value: types.pallet_xcm.pallet.Event.NotifyTargetSendFail["value"]
  ): types.pallet_xcm.pallet.Event.NotifyTargetSendFail {
    return { type: "NotifyTargetSendFail", value }
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   *
   * \[ location, query ID \]
   */
  export function NotifyTargetMigrationFail(
    ...value: types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail["value"]
  ): types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail {
    return { type: "NotifyTargetMigrationFail", value }
  }
}

export const $origin: $.Codec<types.pallet_xcm.pallet.Origin> = codecs.$260
export type Origin = types.pallet_xcm.pallet.Origin.Xcm | types.pallet_xcm.pallet.Origin.Response
export namespace Origin {
  export interface Xcm {
    type: "Xcm"
    value: types.xcm.v1.multilocation.MultiLocation
  }
  export interface Response {
    type: "Response"
    value: types.xcm.v1.multilocation.MultiLocation
  }
  export function Xcm(
    value: types.pallet_xcm.pallet.Origin.Xcm["value"],
  ): types.pallet_xcm.pallet.Origin.Xcm {
    return { type: "Xcm", value }
  }
  export function Response(
    value: types.pallet_xcm.pallet.Origin.Response["value"],
  ): types.pallet_xcm.pallet.Origin.Response {
    return { type: "Response", value }
  }
}

export const $queryStatus: $.Codec<types.pallet_xcm.pallet.QueryStatus> = codecs.$705
export type QueryStatus =
  | types.pallet_xcm.pallet.QueryStatus.Pending
  | types.pallet_xcm.pallet.QueryStatus.VersionNotifier
  | types.pallet_xcm.pallet.QueryStatus.Ready
export namespace QueryStatus {
  export interface Pending {
    type: "Pending"
    responder: types.xcm.VersionedMultiLocation
    maybeNotify: [types.u8, types.u8] | undefined
    timeout: types.u32
  }
  export interface VersionNotifier {
    type: "VersionNotifier"
    origin: types.xcm.VersionedMultiLocation
    isActive: boolean
  }
  export interface Ready {
    type: "Ready"
    response: types.xcm.VersionedResponse
    at: types.u32
  }
  export function Pending(
    value: Omit<types.pallet_xcm.pallet.QueryStatus.Pending, "type">,
  ): types.pallet_xcm.pallet.QueryStatus.Pending {
    return { type: "Pending", ...value }
  }
  export function VersionNotifier(
    value: Omit<types.pallet_xcm.pallet.QueryStatus.VersionNotifier, "type">,
  ): types.pallet_xcm.pallet.QueryStatus.VersionNotifier {
    return { type: "VersionNotifier", ...value }
  }
  export function Ready(
    value: Omit<types.pallet_xcm.pallet.QueryStatus.Ready, "type">,
  ): types.pallet_xcm.pallet.QueryStatus.Ready {
    return { type: "Ready", ...value }
  }
}

export const $versionMigrationStage: $.Codec<types.pallet_xcm.pallet.VersionMigrationStage> =
  codecs.$714
export type VersionMigrationStage =
  | types.pallet_xcm.pallet.VersionMigrationStage.MigrateSupportedVersion
  | types.pallet_xcm.pallet.VersionMigrationStage.MigrateVersionNotifiers
  | types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets
  | types.pallet_xcm.pallet.VersionMigrationStage.MigrateAndNotifyOldTargets
export namespace VersionMigrationStage {
  export interface MigrateSupportedVersion {
    type: "MigrateSupportedVersion"
  }
  export interface MigrateVersionNotifiers {
    type: "MigrateVersionNotifiers"
  }
  export interface NotifyCurrentTargets {
    type: "NotifyCurrentTargets"
    value: Uint8Array | undefined
  }
  export interface MigrateAndNotifyOldTargets {
    type: "MigrateAndNotifyOldTargets"
  }
  export function MigrateSupportedVersion(): types.pallet_xcm.pallet.VersionMigrationStage.MigrateSupportedVersion {
    return { type: "MigrateSupportedVersion" }
  }
  export function MigrateVersionNotifiers(): types.pallet_xcm.pallet.VersionMigrationStage.MigrateVersionNotifiers {
    return { type: "MigrateVersionNotifiers" }
  }
  export function NotifyCurrentTargets(
    value: types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets["value"],
  ): types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets {
    return { type: "NotifyCurrentTargets", value }
  }
  export function MigrateAndNotifyOldTargets(): types.pallet_xcm.pallet.VersionMigrationStage.MigrateAndNotifyOldTargets {
    return { type: "MigrateAndNotifyOldTargets" }
  }
}
