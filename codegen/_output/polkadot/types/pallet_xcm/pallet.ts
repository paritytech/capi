import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_xcm.pallet.Call> = _codec.$423

export const $error: $.Codec<t.types.pallet_xcm.pallet.Error> = _codec.$724

export const $event: $.Codec<t.types.pallet_xcm.pallet.Event> = _codec.$121

export const $origin: $.Codec<t.types.pallet_xcm.pallet.Origin> = _codec.$261

export const $queryStatus: $.Codec<t.types.pallet_xcm.pallet.QueryStatus> = _codec.$713

export const $versionMigrationStage: $.Codec<t.types.pallet_xcm.pallet.VersionMigrationStage> =
  _codec.$722

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_xcm.pallet.Call.send
  | t.types.pallet_xcm.pallet.Call.teleport_assets
  | t.types.pallet_xcm.pallet.Call.reserve_transfer_assets
  | t.types.pallet_xcm.pallet.Call.execute
  | t.types.pallet_xcm.pallet.Call.force_xcm_version
  | t.types.pallet_xcm.pallet.Call.force_default_xcm_version
  | t.types.pallet_xcm.pallet.Call.force_subscribe_version_notify
  | t.types.pallet_xcm.pallet.Call.force_unsubscribe_version_notify
  | t.types.pallet_xcm.pallet.Call.limited_reserve_transfer_assets
  | t.types.pallet_xcm.pallet.Call.limited_teleport_assets
export namespace Call {
  export interface send {
    type: "send"
    dest: t.types.xcm.VersionedMultiLocation
    message: t.types.xcm.VersionedXcm
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
  export interface teleport_assets {
    type: "teleport_assets"
    dest: t.types.xcm.VersionedMultiLocation
    beneficiary: t.types.xcm.VersionedMultiLocation
    assets: t.types.xcm.VersionedMultiAssets
    fee_asset_item: t.types.u32
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
  export interface reserve_transfer_assets {
    type: "reserve_transfer_assets"
    dest: t.types.xcm.VersionedMultiLocation
    beneficiary: t.types.xcm.VersionedMultiLocation
    assets: t.types.xcm.VersionedMultiAssets
    fee_asset_item: t.types.u32
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
    message: t.types.xcm.VersionedXcm
    max_weight: t.types.u64
  }
  /**
   * Extoll that a particular destination can be communicated with through a particular
   * version of XCM.
   *
   * - `origin`: Must be Root.
   * - `location`: The destination that is being described.
   * - `xcm_version`: The latest version of XCM that `location` supports.
   */
  export interface force_xcm_version {
    type: "force_xcm_version"
    location: t.types.xcm.v1.multilocation.MultiLocation
    xcm_version: t.types.u32
  }
  /**
   * Set a safe XCM version (the version that XCM should be encoded with if the most recent
   * version a destination can accept is unknown).
   *
   * - `origin`: Must be Root.
   * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
   */
  export interface force_default_xcm_version {
    type: "force_default_xcm_version"
    maybe_xcm_version: t.types.u32 | undefined
  }
  /**
   * Ask a location to notify us regarding their XCM version and any changes to it.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we should subscribe for XCM version notifications.
   */
  export interface force_subscribe_version_notify {
    type: "force_subscribe_version_notify"
    location: t.types.xcm.VersionedMultiLocation
  }
  /**
   * Require that a particular destination should no longer notify us regarding any XCM
   * version changes.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we are currently subscribed for XCM version
   *   notifications which we no longer desire.
   */
  export interface force_unsubscribe_version_notify {
    type: "force_unsubscribe_version_notify"
    location: t.types.xcm.VersionedMultiLocation
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
  export interface limited_reserve_transfer_assets {
    type: "limited_reserve_transfer_assets"
    dest: t.types.xcm.VersionedMultiLocation
    beneficiary: t.types.xcm.VersionedMultiLocation
    assets: t.types.xcm.VersionedMultiAssets
    fee_asset_item: t.types.u32
    weight_limit: t.types.xcm.v2.WeightLimit
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
  export interface limited_teleport_assets {
    type: "limited_teleport_assets"
    dest: t.types.xcm.VersionedMultiLocation
    beneficiary: t.types.xcm.VersionedMultiLocation
    assets: t.types.xcm.VersionedMultiAssets
    fee_asset_item: t.types.u32
    weight_limit: t.types.xcm.v2.WeightLimit
  }
  export function send(
    value: Omit<t.types.pallet_xcm.pallet.Call.send, "type">,
  ): t.types.pallet_xcm.pallet.Call.send {
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
  export function teleport_assets(
    value: Omit<t.types.pallet_xcm.pallet.Call.teleport_assets, "type">,
  ): t.types.pallet_xcm.pallet.Call.teleport_assets {
    return { type: "teleport_assets", ...value }
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
  export function reserve_transfer_assets(
    value: Omit<t.types.pallet_xcm.pallet.Call.reserve_transfer_assets, "type">,
  ): t.types.pallet_xcm.pallet.Call.reserve_transfer_assets {
    return { type: "reserve_transfer_assets", ...value }
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
    value: Omit<t.types.pallet_xcm.pallet.Call.execute, "type">,
  ): t.types.pallet_xcm.pallet.Call.execute {
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
  export function force_xcm_version(
    value: Omit<t.types.pallet_xcm.pallet.Call.force_xcm_version, "type">,
  ): t.types.pallet_xcm.pallet.Call.force_xcm_version {
    return { type: "force_xcm_version", ...value }
  }
  /**
   * Set a safe XCM version (the version that XCM should be encoded with if the most recent
   * version a destination can accept is unknown).
   *
   * - `origin`: Must be Root.
   * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
   */
  export function force_default_xcm_version(
    value: Omit<t.types.pallet_xcm.pallet.Call.force_default_xcm_version, "type">,
  ): t.types.pallet_xcm.pallet.Call.force_default_xcm_version {
    return { type: "force_default_xcm_version", ...value }
  }
  /**
   * Ask a location to notify us regarding their XCM version and any changes to it.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we should subscribe for XCM version notifications.
   */
  export function force_subscribe_version_notify(
    value: Omit<t.types.pallet_xcm.pallet.Call.force_subscribe_version_notify, "type">,
  ): t.types.pallet_xcm.pallet.Call.force_subscribe_version_notify {
    return { type: "force_subscribe_version_notify", ...value }
  }
  /**
   * Require that a particular destination should no longer notify us regarding any XCM
   * version changes.
   *
   * - `origin`: Must be Root.
   * - `location`: The location to which we are currently subscribed for XCM version
   *   notifications which we no longer desire.
   */
  export function force_unsubscribe_version_notify(
    value: Omit<t.types.pallet_xcm.pallet.Call.force_unsubscribe_version_notify, "type">,
  ): t.types.pallet_xcm.pallet.Call.force_unsubscribe_version_notify {
    return { type: "force_unsubscribe_version_notify", ...value }
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
  export function limited_reserve_transfer_assets(
    value: Omit<t.types.pallet_xcm.pallet.Call.limited_reserve_transfer_assets, "type">,
  ): t.types.pallet_xcm.pallet.Call.limited_reserve_transfer_assets {
    return { type: "limited_reserve_transfer_assets", ...value }
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
  export function limited_teleport_assets(
    value: Omit<t.types.pallet_xcm.pallet.Call.limited_teleport_assets, "type">,
  ): t.types.pallet_xcm.pallet.Call.limited_teleport_assets {
    return { type: "limited_teleport_assets", ...value }
  }
}

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

/** The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted by this pallet. */
export type Event =
  | t.types.pallet_xcm.pallet.Event.Attempted
  | t.types.pallet_xcm.pallet.Event.Sent
  | t.types.pallet_xcm.pallet.Event.UnexpectedResponse
  | t.types.pallet_xcm.pallet.Event.ResponseReady
  | t.types.pallet_xcm.pallet.Event.Notified
  | t.types.pallet_xcm.pallet.Event.NotifyOverweight
  | t.types.pallet_xcm.pallet.Event.NotifyDispatchError
  | t.types.pallet_xcm.pallet.Event.NotifyDecodeFailed
  | t.types.pallet_xcm.pallet.Event.InvalidResponder
  | t.types.pallet_xcm.pallet.Event.InvalidResponderVersion
  | t.types.pallet_xcm.pallet.Event.ResponseTaken
  | t.types.pallet_xcm.pallet.Event.AssetsTrapped
  | t.types.pallet_xcm.pallet.Event.VersionChangeNotified
  | t.types.pallet_xcm.pallet.Event.SupportedVersionChanged
  | t.types.pallet_xcm.pallet.Event.NotifyTargetSendFail
  | t.types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail
  | t.types.pallet_xcm.pallet.Event.AssetsClaimed
export namespace Event {
  /**
   * Execution of an XCM message was attempted.
   *
   * \[ outcome \]
   */
  export interface Attempted {
    type: "Attempted"
    value: t.types.xcm.v2.traits.Outcome
  }
  /**
   * A XCM message was sent.
   *
   * \[ origin, destination, message \]
   */
  export interface Sent {
    type: "Sent"
    value: [
      t.types.xcm.v1.multilocation.MultiLocation,
      t.types.xcm.v1.multilocation.MultiLocation,
      Array<t.types.xcm.v2.Instruction>,
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
    value: [t.types.xcm.v1.multilocation.MultiLocation, t.types.u64]
  }
  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   *
   * \[ id, response \]
   */
  export interface ResponseReady {
    type: "ResponseReady"
    value: [t.types.u64, t.types.xcm.v2.Response]
  }
  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   *
   * \[ id, pallet index, call index \]
   */
  export interface Notified {
    type: "Notified"
    value: [t.types.u64, t.types.u8, t.types.u8]
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
      t.types.u64,
      t.types.u8,
      t.types.u8,
      t.types.sp_weights.weight_v2.Weight,
      t.types.sp_weights.weight_v2.Weight,
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
    value: [t.types.u64, t.types.u8, t.types.u8]
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
    value: [t.types.u64, t.types.u8, t.types.u8]
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
      t.types.xcm.v1.multilocation.MultiLocation,
      t.types.u64,
      t.types.xcm.v1.multilocation.MultiLocation | undefined,
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
    value: [t.types.xcm.v1.multilocation.MultiLocation, t.types.u64]
  }
  /**
   * Received query response has been read and removed.
   *
   * \[ id \]
   */
  export interface ResponseTaken {
    type: "ResponseTaken"
    value: t.types.u64
  }
  /**
   * Some assets have been placed in an asset trap.
   *
   * \[ hash, origin, assets \]
   */
  export interface AssetsTrapped {
    type: "AssetsTrapped"
    value: [
      t.types.primitive_types.H256,
      t.types.xcm.v1.multilocation.MultiLocation,
      t.types.xcm.VersionedMultiAssets,
    ]
  }
  /**
   * An XCM version change notification message has been attempted to be sent.
   *
   * \[ destination, result \]
   */
  export interface VersionChangeNotified {
    type: "VersionChangeNotified"
    value: [t.types.xcm.v1.multilocation.MultiLocation, t.types.u32]
  }
  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   *
   * \[ location, XCM version \]
   */
  export interface SupportedVersionChanged {
    type: "SupportedVersionChanged"
    value: [t.types.xcm.v1.multilocation.MultiLocation, t.types.u32]
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   *
   * \[ location, query ID, error \]
   */
  export interface NotifyTargetSendFail {
    type: "NotifyTargetSendFail"
    value: [t.types.xcm.v1.multilocation.MultiLocation, t.types.u64, t.types.xcm.v2.traits.Error]
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   *
   * \[ location, query ID \]
   */
  export interface NotifyTargetMigrationFail {
    type: "NotifyTargetMigrationFail"
    value: [t.types.xcm.VersionedMultiLocation, t.types.u64]
  }
  /**
   * Some assets have been claimed from an asset trap
   *
   * \[ hash, origin, assets \]
   */
  export interface AssetsClaimed {
    type: "AssetsClaimed"
    value: [
      t.types.primitive_types.H256,
      t.types.xcm.v1.multilocation.MultiLocation,
      t.types.xcm.VersionedMultiAssets,
    ]
  }
  /**
   * Execution of an XCM message was attempted.
   *
   * \[ outcome \]
   */
  export function Attempted(
    value: t.types.pallet_xcm.pallet.Event.Attempted["value"],
  ): t.types.pallet_xcm.pallet.Event.Attempted {
    return { type: "Attempted", value }
  }
  /**
   * A XCM message was sent.
   *
   * \[ origin, destination, message \]
   */
  export function Sent(
    ...value: t.types.pallet_xcm.pallet.Event.Sent["value"]
  ): t.types.pallet_xcm.pallet.Event.Sent {
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
    ...value: t.types.pallet_xcm.pallet.Event.UnexpectedResponse["value"]
  ): t.types.pallet_xcm.pallet.Event.UnexpectedResponse {
    return { type: "UnexpectedResponse", value }
  }
  /**
   * Query response has been received and is ready for taking with `take_response`. There is
   * no registered notification call.
   *
   * \[ id, response \]
   */
  export function ResponseReady(
    ...value: t.types.pallet_xcm.pallet.Event.ResponseReady["value"]
  ): t.types.pallet_xcm.pallet.Event.ResponseReady {
    return { type: "ResponseReady", value }
  }
  /**
   * Query response has been received and query is removed. The registered notification has
   * been dispatched and executed successfully.
   *
   * \[ id, pallet index, call index \]
   */
  export function Notified(
    ...value: t.types.pallet_xcm.pallet.Event.Notified["value"]
  ): t.types.pallet_xcm.pallet.Event.Notified {
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
    ...value: t.types.pallet_xcm.pallet.Event.NotifyOverweight["value"]
  ): t.types.pallet_xcm.pallet.Event.NotifyOverweight {
    return { type: "NotifyOverweight", value }
  }
  /**
   * Query response has been received and query is removed. There was a general error with
   * dispatching the notification call.
   *
   * \[ id, pallet index, call index \]
   */
  export function NotifyDispatchError(
    ...value: t.types.pallet_xcm.pallet.Event.NotifyDispatchError["value"]
  ): t.types.pallet_xcm.pallet.Event.NotifyDispatchError {
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
    ...value: t.types.pallet_xcm.pallet.Event.NotifyDecodeFailed["value"]
  ): t.types.pallet_xcm.pallet.Event.NotifyDecodeFailed {
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
    ...value: t.types.pallet_xcm.pallet.Event.InvalidResponder["value"]
  ): t.types.pallet_xcm.pallet.Event.InvalidResponder {
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
    ...value: t.types.pallet_xcm.pallet.Event.InvalidResponderVersion["value"]
  ): t.types.pallet_xcm.pallet.Event.InvalidResponderVersion {
    return { type: "InvalidResponderVersion", value }
  }
  /**
   * Received query response has been read and removed.
   *
   * \[ id \]
   */
  export function ResponseTaken(
    value: t.types.pallet_xcm.pallet.Event.ResponseTaken["value"],
  ): t.types.pallet_xcm.pallet.Event.ResponseTaken {
    return { type: "ResponseTaken", value }
  }
  /**
   * Some assets have been placed in an asset trap.
   *
   * \[ hash, origin, assets \]
   */
  export function AssetsTrapped(
    ...value: t.types.pallet_xcm.pallet.Event.AssetsTrapped["value"]
  ): t.types.pallet_xcm.pallet.Event.AssetsTrapped {
    return { type: "AssetsTrapped", value }
  }
  /**
   * An XCM version change notification message has been attempted to be sent.
   *
   * \[ destination, result \]
   */
  export function VersionChangeNotified(
    ...value: t.types.pallet_xcm.pallet.Event.VersionChangeNotified["value"]
  ): t.types.pallet_xcm.pallet.Event.VersionChangeNotified {
    return { type: "VersionChangeNotified", value }
  }
  /**
   * The supported version of a location has been changed. This might be through an
   * automatic notification or a manual intervention.
   *
   * \[ location, XCM version \]
   */
  export function SupportedVersionChanged(
    ...value: t.types.pallet_xcm.pallet.Event.SupportedVersionChanged["value"]
  ): t.types.pallet_xcm.pallet.Event.SupportedVersionChanged {
    return { type: "SupportedVersionChanged", value }
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * sending the notification to it.
   *
   * \[ location, query ID, error \]
   */
  export function NotifyTargetSendFail(
    ...value: t.types.pallet_xcm.pallet.Event.NotifyTargetSendFail["value"]
  ): t.types.pallet_xcm.pallet.Event.NotifyTargetSendFail {
    return { type: "NotifyTargetSendFail", value }
  }
  /**
   * A given location which had a version change subscription was dropped owing to an error
   * migrating the location to our new XCM format.
   *
   * \[ location, query ID \]
   */
  export function NotifyTargetMigrationFail(
    ...value: t.types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail["value"]
  ): t.types.pallet_xcm.pallet.Event.NotifyTargetMigrationFail {
    return { type: "NotifyTargetMigrationFail", value }
  }
  /**
   * Some assets have been claimed from an asset trap
   *
   * \[ hash, origin, assets \]
   */
  export function AssetsClaimed(
    ...value: t.types.pallet_xcm.pallet.Event.AssetsClaimed["value"]
  ): t.types.pallet_xcm.pallet.Event.AssetsClaimed {
    return { type: "AssetsClaimed", value }
  }
}

export type Origin =
  | t.types.pallet_xcm.pallet.Origin.Xcm
  | t.types.pallet_xcm.pallet.Origin.Response
export namespace Origin {
  export interface Xcm {
    type: "Xcm"
    value: t.types.xcm.v1.multilocation.MultiLocation
  }
  export interface Response {
    type: "Response"
    value: t.types.xcm.v1.multilocation.MultiLocation
  }
  export function Xcm(
    value: t.types.pallet_xcm.pallet.Origin.Xcm["value"],
  ): t.types.pallet_xcm.pallet.Origin.Xcm {
    return { type: "Xcm", value }
  }
  export function Response(
    value: t.types.pallet_xcm.pallet.Origin.Response["value"],
  ): t.types.pallet_xcm.pallet.Origin.Response {
    return { type: "Response", value }
  }
}

export type QueryStatus =
  | t.types.pallet_xcm.pallet.QueryStatus.Pending
  | t.types.pallet_xcm.pallet.QueryStatus.VersionNotifier
  | t.types.pallet_xcm.pallet.QueryStatus.Ready
export namespace QueryStatus {
  export interface Pending {
    type: "Pending"
    responder: t.types.xcm.VersionedMultiLocation
    maybe_notify: [t.types.u8, t.types.u8] | undefined
    timeout: t.types.u32
  }
  export interface VersionNotifier {
    type: "VersionNotifier"
    origin: t.types.xcm.VersionedMultiLocation
    is_active: boolean
  }
  export interface Ready {
    type: "Ready"
    response: t.types.xcm.VersionedResponse
    at: t.types.u32
  }
  export function Pending(
    value: Omit<t.types.pallet_xcm.pallet.QueryStatus.Pending, "type">,
  ): t.types.pallet_xcm.pallet.QueryStatus.Pending {
    return { type: "Pending", ...value }
  }
  export function VersionNotifier(
    value: Omit<t.types.pallet_xcm.pallet.QueryStatus.VersionNotifier, "type">,
  ): t.types.pallet_xcm.pallet.QueryStatus.VersionNotifier {
    return { type: "VersionNotifier", ...value }
  }
  export function Ready(
    value: Omit<t.types.pallet_xcm.pallet.QueryStatus.Ready, "type">,
  ): t.types.pallet_xcm.pallet.QueryStatus.Ready {
    return { type: "Ready", ...value }
  }
}

export type VersionMigrationStage =
  | t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateSupportedVersion
  | t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateVersionNotifiers
  | t.types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets
  | t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateAndNotifyOldTargets
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
  export function MigrateSupportedVersion(): t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateSupportedVersion {
    return { type: "MigrateSupportedVersion" }
  }
  export function MigrateVersionNotifiers(): t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateVersionNotifiers {
    return { type: "MigrateVersionNotifiers" }
  }
  export function NotifyCurrentTargets(
    value: t.types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets["value"],
  ): t.types.pallet_xcm.pallet.VersionMigrationStage.NotifyCurrentTargets {
    return { type: "NotifyCurrentTargets", value }
  }
  export function MigrateAndNotifyOldTargets(): t.types.pallet_xcm.pallet.VersionMigrationStage.MigrateAndNotifyOldTargets {
    return { type: "MigrateAndNotifyOldTargets" }
  }
}
