import { alice, Rune, ValueRune } from "capi"
import { types, XcmPallet } from "zombienet/examples/xcm/zombienet.toml/alice/@latest/mod.ts"
import { Event as XcmPalletEvent } from "zombienet/examples/xcm/zombienet.toml/alice/@latest/types/pallet_xcm/pallet.ts"
import { RuntimeEvent as AliceRuntimeEvent } from "zombienet/examples/xcm/zombienet.toml/alice/@latest/types/rococo_runtime/mod.ts"
import { client, System } from "zombienet/examples/xcm/zombienet.toml/collator/@latest/mod.ts"
import { Event as ParachainSystemEvent } from "zombienet/examples/xcm/zombienet.toml/collator/@latest/types/cumulus_pallet_parachain_system/pallet.ts"
import { RuntimeEvent as CollatorRuntimeEvent } from "zombienet/examples/xcm/zombienet.toml/collator/@latest/types/statemine_runtime.ts"

// TODO: have the recipient associate the downward message with the sender

const aliceFree = System.Account
  .entry([alice.publicKey])
  .access("data", "free")

console.log("Initial balance:", await aliceFree.run())

const {
  VersionedMultiAssets,
  VersionedMultiLocation,
  v1: {
    junction: { Junction },
    multilocation: { Junctions },
    multiasset: { AssetId, Fungibility },
  },
  v0: { junction: { NetworkId } },
  v2: { WeightLimit },
} = types.xcm

class CannotFindAttemptError extends Error {
  override readonly name = "CannotFindAttemptError"
}

const initiatedEvent = XcmPallet
  .limitedTeleportAssets({
    dest: VersionedMultiLocation.V1(Rune.rec({
      parents: 0,
      interior: Junctions.X1(Junction.Parachain(1000)),
    })),
    beneficiary: VersionedMultiLocation.V1(Rune.rec({
      parents: 0,
      interior: Junctions.X1(Junction.AccountId32({
        id: alice.publicKey,
        network: NetworkId.Any(),
      })),
    })),
    assets: VersionedMultiAssets.V1(Rune.array([Rune.rec({
      id: AssetId.Concrete(Rune.rec({
        parents: 0,
        interior: Junctions.Here(),
      })),
      fun: Fungibility.Fungible(500_000_000_000_000n),
    })])),
    feeAssetItem: 0,
    weightLimit: WeightLimit.Unlimited(),
  })
  .signed({ sender: alice })
  .sent()
  .logStatus("Teleportation status:")
  .txEvents()
  .map((events) =>
    events.find((e) =>
      AliceRuntimeEvent.isXcmPallet(e.event)
      && XcmPalletEvent.isAttempted(e.event.value)
    )
      ?? new CannotFindAttemptError()
  )
  .unhandle(CannotFindAttemptError)

const processedEvent = System.Events
  .entry([], client.latestBlock.hash)
  .into(ValueRune)
  .map((events) =>
    events
      .find((e) =>
        CollatorRuntimeEvent.isParachainSystem(e.event)
        && ParachainSystemEvent.isDownwardMessagesProcessed(e.event.value)
      )
  )
  .filter((event) => !!event)

console.log(
  await Rune
    .rec({ initiatedEvent, processedEvent })
    .run(),
)
console.log("Final balance:", await aliceFree.run())
