import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** The latest available query index. */
export const QueryCounter = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "XcmPallet",
  "QueryCounter",
  $.tuple(),
  codecs.$10,
)

/** The ongoing queries. */
export const Queries = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "XcmPallet",
  "Queries",
  $.tuple(codecs.$10),
  codecs.$713,
)

/**
 *  The existing asset traps.
 *
 *  Key is the blake2 256 hash of (origin, versioned `MultiAssets`) pair. Value is the number of
 *  times this pair has been trapped (usually just 1 if it exists at all).
 */
export const AssetTraps = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "XcmPallet",
  "AssetTraps",
  $.tuple(codecs.$11),
  codecs.$4,
)

/**
 *  Default version to encode XCM when latest version of destination is unknown. If `None`,
 *  then the destinations whose XCM version is unknown are considered unreachable.
 */
export const SafeXcmVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "XcmPallet",
  "SafeXcmVersion",
  $.tuple(),
  codecs.$4,
)

/** The Latest versions that we know various locations support. */
export const SupportedVersion = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "XcmPallet",
  "SupportedVersion",
  codecs.$717,
  codecs.$4,
)

/** All locations that we have requested version notifications from. */
export const VersionNotifiers = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "XcmPallet",
  "VersionNotifiers",
  codecs.$717,
  codecs.$10,
)

/**
 *  The target locations that are subscribed to our version changes, as well as the most recent
 *  of our versions we informed them of.
 */
export const VersionNotifyTargets = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "XcmPallet",
  "VersionNotifyTargets",
  codecs.$717,
  codecs.$718,
)

/**
 *  Destinations whose latest XCM version we would like to know. Duplicates not allowed, and
 *  the `u32` counter is the number of times that a send to the destination has been attempted,
 *  which is used as a prioritization.
 */
export const VersionDiscoveryQueue = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "XcmPallet",
  "VersionDiscoveryQueue",
  $.tuple(),
  codecs.$719,
)

/** The current migration's stage, if any. */
export const CurrentMigration = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "XcmPallet",
  "CurrentMigration",
  $.tuple(),
  codecs.$722,
)

export function send(
  value: Omit<types.pallet_xcm.pallet.Call.send, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "send" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "teleportAssets" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "reserveTransferAssets" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "execute" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "forceXcmVersion" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "forceDefaultXcmVersion" } }
}

/**
 * Ask a location to notify us regarding their XCM version and any changes to it.
 *
 * - `origin`: Must be Root.
 * - `location`: The location to which we should subscribe for XCM version notifications.
 */
export function forceSubscribeVersionNotify(
  value: Omit<types.pallet_xcm.pallet.Call.forceSubscribeVersionNotify, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "forceSubscribeVersionNotify" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "forceUnsubscribeVersionNotify" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "limitedReserveTransferAssets" } }
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
): types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "limitedTeleportAssets" } }
}
