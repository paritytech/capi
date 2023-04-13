/**
 * @title XCM Asset Teleportation
 * @stability nearing
 * @description Initialize a limited asset teleportation from a relaychain to a
 * parachain and listen for the processed event on the parachain. Finally, read
 * the new balance of the user to whom the asset was transferred.
 */

import {
  VersionedMultiAssets,
  VersionedMultiLocation,
  XcmPallet,
  XcmV2AssetId,
  XcmV2Fungibility,
  XcmV2Junction,
  XcmV2Junctions,
  XcmV2MultiAsset,
  XcmV2MultiAssets,
  XcmV2MultiLocation,
  XcmV2NetworkId,
  XcmV2WeightLimit,
} from "@capi/rococo-dev"
import {
  chain as parachain,
  CumulusPalletParachainSystemEvent,
  RuntimeEvent,
  System,
} from "@capi/rococo-dev/statemine"
import { assert } from "asserts"
import { alice } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"

// Reference Alice's free balance.
const aliceBalance = System.Account
  .value(alice.publicKey)
  .unhandle(undefined)
  .access("data", "free")

// Read the initial free.
const aliceFreeInitial = await aliceBalance.run()
console.log("Alice initial free:", aliceFreeInitial)

XcmPallet
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
            id: alice.publicKey,
            network: XcmV2NetworkId.Any(),
          }),
        ),
      }),
    ),
    assets: VersionedMultiAssets.V2(XcmV2MultiAssets([XcmV2MultiAsset({
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
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Teleportation:")
  .finalized()
  .run()

// Iterate over the parachain events until receiving a downward message processed event,
// at which point we can read alice's free balance, which should be greater than the initial.
outer:
for await (const e of System.Events.value(undefined, parachain.latestBlockHash).iter()) {
  if (e) {
    for (const { event } of e) {
      if (
        RuntimeEvent.isParachainSystem(event)
        && CumulusPalletParachainSystemEvent.isDownwardMessagesProcessed(event.value)
      ) {
        const aliceFreeFinal = await aliceBalance.run()
        console.log("Alice final free:", aliceFreeFinal)
        assert(aliceFreeFinal > aliceFreeInitial)
        break outer
      }
    }
  }
}
