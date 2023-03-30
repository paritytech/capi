/**
 * @title XCM Asset Teleportation
 * @stability nearing
 *
 * Initialize a limited asset teleportation from a relaychain to a parachain
 * and listen for the processed event on the parachain. Finally, read the new
 * balance of the user to whom the asset was transferred.
 */

import { alice, Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { types, XcmPallet } from "zombienet/statemine.toml/alice/@latest/mod.js"
import { chain as parachain, System } from "zombienet/statemine.toml/collator/@latest/mod.js"
import { Event } from "zombienet/statemine.toml/collator/@latest/types/cumulus_pallet_parachain_system/pallet.js"
import { RuntimeEvent } from "zombienet/statemine.toml/collator/@latest/types/statemine_runtime.js"

// Destructure the various type factories for convenient access.
const {
  VersionedMultiAssets,
  VersionedMultiLocation,
  v2: {
    NetworkId,
    WeightLimit,
    junction: { Junction },
    multilocation: { Junctions },
    multiasset: { AssetId, Fungibility },
  },
} = types.xcm

// Reference Alice's free balance.
const aliceBalance = System.Account
  .value(alice.publicKey)
  .unhandle(undefined)
  .access("data", "free")

// Read the initial free.
console.log("Alice balance before:", await aliceBalance.run())

XcmPallet
  .limitedTeleportAssets({
    dest: VersionedMultiLocation.V2(Rune.rec({
      parents: 0,
      interior: Junctions.X1(Junction.Parachain(1000)),
    })),
    beneficiary: VersionedMultiLocation.V2(Rune.rec({
      parents: 0,
      interior: Junctions.X1(Junction.AccountId32({
        id: alice.publicKey,
        network: NetworkId.Any(),
      })),
    })),
    assets: VersionedMultiAssets.V2(Rune.array([Rune.rec({
      id: AssetId.Concrete(Rune.rec({
        parents: 0,
        interior: Junctions.Here(),
      })),
      fun: Fungibility.Fungible(500_000_000_000_000n),
    })])),
    feeAssetItem: 0,
    weightLimit: WeightLimit.Unlimited(),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

// Iterate over the parachain events until receiving a downward message processed event,
// at which point we can read alice's balance, which should be updated.
outer:
for await (const e of System.Events.value(undefined, parachain.latestBlock.hash).iter()) {
  if (e) {
    for (const { event } of e) {
      if (RuntimeEvent.isParachainSystem(event) && Event.isDownwardMessagesProcessed(event.value)) {
        console.log("Alice balance after:", await aliceBalance.run())
        break outer
      }
    }
  }
}
