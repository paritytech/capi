import { alice, Rune, ValueRune } from "capi"
import { types, XcmPallet } from "zombienet/statemine.toml/alice/@latest/mod.js"
import { Event as XcmPalletEvent } from "zombienet/statemine.toml/alice/@latest/types/pallet_xcm/pallet.js"
import { RuntimeEvent as AliceRuntimeEvent } from "zombienet/statemine.toml/alice/@latest/types/rococo_runtime/mod.js"
import { chain as collator, System } from "zombienet/statemine.toml/collator/@latest/mod.js"
import { Event as ParachainSystemEvent } from "zombienet/statemine.toml/collator/@latest/types/cumulus_pallet_parachain_system/pallet.js"
import { RuntimeEvent as CollatorRuntimeEvent } from "zombienet/statemine.toml/collator/@latest/types/statemine_runtime.js"
import { signature } from "../patterns/signature/polkadot.ts"

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

class CannotFindAttemptError extends Error {
  override readonly name = "CannotFindAttemptError"
}

const initiatedEvent = XcmPallet
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
  .dbgStatus("Teleportation status:")
  .finalizedEvents()
  .into(ValueRune)
  .map((events) =>
    events.find((e) =>
      AliceRuntimeEvent.isXcmPallet(e.event)
      && XcmPalletEvent.isAttempted(e.event.value)
    ) ?? new CannotFindAttemptError()
  )
  .unhandle(CannotFindAttemptError)
  .dbg("Initiated event:")

const processedEvent = System.Events
  .value(undefined, collator.latestBlock.hash)
  .map((events) =>
    events?.find((e) =>
      CollatorRuntimeEvent.isParachainSystem(e.event)
      && ParachainSystemEvent.isDownwardMessagesProcessed(e.event.value)
    )
  )
  .filter((event) => !!event)
  .dbg("Processed events:")

// TODO: have the recipient associate the downward message with the sender
await logAliceBalance()
  .chain(() => Rune.tuple([initiatedEvent, processedEvent]))
  .chain(() => logAliceBalance())
  .run()

function logAliceBalance() {
  return System.Account
    .value(alice.publicKey)
    .unhandle(undefined)
    .access("data", "free")
    .dbg("Alice balance:")
}
