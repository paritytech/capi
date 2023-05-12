/**
 * @title XCM Asset Teleportation
 * @stability nearing
 * @description Initialize a limited asset teleportation from a relaychain to a
 * parachain and listen for the processed event on the parachain. Finally, read
 * the new balance of the user to whom the asset was transferred.
 * @test_skip
 */

import {
  rococoDev,
  VersionedMultiAssets,
  VersionedMultiLocation,
  XcmV2AssetId,
  XcmV2Fungibility,
  XcmV2Junction,
  XcmV2Junctions,
  XcmV2MultiAsset,
  XcmV2MultiLocation,
  XcmV2NetworkId,
  XcmV2WeightLimit,
} from "@capi/rococo-dev"
import {
  CumulusPalletParachainSystemEvent,
  rococoDevWestmint,
  RuntimeEvent,
} from "@capi/rococo-dev-westmint"
import { assert } from "asserts"
import { createDevUsers, Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa } = await createDevUsers()

/// Reference Alexa's free balance.
const alexaBalance = rococoDevWestmint.System.Account
  .value(alexa.publicKey)
  .unhandle(undefined)
  .access("data", "free")

/// Read the initial free.
const alexaFreeInitial = await alexaBalance.run()
console.log("Alexa initial free:", alexaFreeInitial)

/// Execute the teleportation without blocking.
rococoDev.XcmPallet
  .limitedTeleportAssets({
    dest: VersionedMultiLocation.V2(
      XcmV2MultiLocation({
        parents: 0,
        interior: XcmV2Junctions.X1(XcmV2Junction.Parachain(1000)),
      }),
    ),
    beneficiary: VersionedMultiLocation.V2(
      XcmV2MultiLocation({
        parents: 0,
        interior: XcmV2Junctions.X1(
          XcmV2Junction.AccountId32({
            id: alexa.publicKey,
            network: XcmV2NetworkId.Any(),
          }),
        ),
      }),
    ),
    assets: VersionedMultiAssets.V2(Rune.array([XcmV2MultiAsset({
      id: XcmV2AssetId.Concrete(
        XcmV2MultiLocation({
          parents: 0,
          interior: XcmV2Junctions.Here(),
        }),
      ),
      fun: XcmV2Fungibility.Fungible(500_000_000_000_000n),
    })])),
    feeAssetItem: 0,
    weightLimit: XcmV2WeightLimit.Unlimited(),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Teleportation:")
  .finalizedEvents()
  .unhandleFailed()
  .run()

/// Iterate over the parachain events until receiving a downward message processed event,
/// at which point we can read alexa's free balance, which should be greater than the initial.
outer:
for await (
  const e of rococoDevWestmint.System.Events
    .value(undefined, rococoDevWestmint.latestBlockHash)
    .iter()
) {
  if (e) {
    for (const { event } of e) {
      if (
        RuntimeEvent.isParachainSystem(event)
        && CumulusPalletParachainSystemEvent.isDownwardMessagesProcessed(event.value)
      ) {
        const alexaFreeFinal = await alexaBalance.run()
        console.log("Alexa final free:", alexaFreeFinal)
        assert(alexaFreeFinal > alexaFreeInitial)
        break outer
      }
    }
  }
}
