import { alice, ApplyExtrinsicEventPhase, Event, Rune, RuntimeEvent, ValueRune } from "capi"
import { types, XcmPallet } from "zombienet/examples/xcm/zombienet.toml/alice/@latest/mod.ts"
import { Event as XcmPalletEvent } from "zombienet/examples/xcm/zombienet.toml/alice/@latest/types/pallet_xcm/pallet.ts"
import { client, System } from "zombienet/examples/xcm/zombienet.toml/collator/@latest/mod.ts"
import { Event as ParachainSystemEvent } from "zombienet/examples/xcm/zombienet.toml/collator/@latest/types/cumulus_pallet_parachain_system/pallet.ts"

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
  .map((events) => events.find(isXcmPalletAttemptedEvent) ?? new CannotFindAttemptError())
  .unhandle(CannotFindAttemptError)

const processedEvent = System.Events
  .entry([], client.blockHash)
  .into(ValueRune)
  .map((events) => events.find(isParachainSystemDownwardMessageProcessedEvent))
  .filter((event) => !!event)

console.log(
  await Rune
    .rec({ initiatedEvent, processedEvent })
    .run(),
)
console.log("Final balance:", await aliceFree.run())

function isXcmPalletAttemptedEvent(
  e: Event,
): e is Event<ApplyExtrinsicEventPhase, RuntimeEvent<"XcmPallet", XcmPalletEvent.Attempted>> {
  const { event } = e
  return event.type === "XcmPallet" && event.value.type === "Attempted"
}

function isParachainSystemDownwardMessageProcessedEvent(
  e: Event,
): e is Event<
  ApplyExtrinsicEventPhase,
  RuntimeEvent<"ParachainSystem", ParachainSystemEvent.DownwardMessagesProcessed>
> {
  const { event } = e
  return event.type === "ParachainSystem" && event.value.type === "DownwardMessagesProcessed"
}
