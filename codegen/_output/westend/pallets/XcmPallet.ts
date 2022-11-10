import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  The existing asset traps.
 *
 *  Key is the blake2 256 hash of (origin, versioned `MultiAssets`) pair. Value is the number of
 *  times this pair has been trapped (usually just 1 if it exists at all).
 */
export const AssetTraps = {
  type: "Map",
  modifier: "Default",
  hashers: ["Identity"],
  key: $.tuple(_codec.$11),
  value: _codec.$4,
}

/** The current migration's stage, if any. */
export const CurrentMigration = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$722,
}

/** The ongoing queries. */
export const Queries = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Blake2_128Concat"],
  key: $.tuple(_codec.$10),
  value: _codec.$713,
}

/** The latest available query index. */
export const QueryCounter = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$10,
}

/**
 *  Default version to encode XCM when latest version of destination is unknown. If `None`,
 *  then the destinations whose XCM version is unknown are considered unreachable.
 */
export const SafeXcmVersion = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** The Latest versions that we know various locations support. */
export const SupportedVersion = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Blake2_128Concat"],
  key: _codec.$717,
  value: _codec.$4,
}

/**
 *  Destinations whose latest XCM version we would like to know. Duplicates not allowed, and
 *  the `u32` counter is the number of times that a send to the destination has been attempted,
 *  which is used as a prioritization.
 */
export const VersionDiscoveryQueue = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$719,
}

/** All locations that we have requested version notifications from. */
export const VersionNotifiers = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Blake2_128Concat"],
  key: _codec.$717,
  value: _codec.$10,
}

/**
 *  The target locations that are subscribed to our version changes, as well as the most recent
 *  of our versions we informed them of.
 */
export const VersionNotifyTargets = {
  type: "Map",
  modifier: "Optional",
  hashers: ["Twox64Concat", "Blake2_128Concat"],
  key: _codec.$717,
  value: _codec.$718,
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "execute" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "force_default_xcm_version" } }
}

/**
 * Ask a location to notify us regarding their XCM version and any changes to it.
 *
 * - `origin`: Must be Root.
 * - `location`: The location to which we should subscribe for XCM version notifications.
 */
export function force_subscribe_version_notify(
  value: Omit<t.types.pallet_xcm.pallet.Call.force_subscribe_version_notify, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "force_subscribe_version_notify" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "force_unsubscribe_version_notify" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "force_xcm_version" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "limited_reserve_transfer_assets" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "limited_teleport_assets" } }
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
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "reserve_transfer_assets" } }
}

export function send(
  value: Omit<t.types.pallet_xcm.pallet.Call.send, "type">,
): t.types.polkadot_runtime.RuntimeCall {
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
export function teleport_assets(
  value: Omit<t.types.pallet_xcm.pallet.Call.teleport_assets, "type">,
): t.types.polkadot_runtime.RuntimeCall {
  return { type: "XcmPallet", value: { ...value, type: "teleport_assets" } }
}
