import {
  types,
  XcmPallet,
} from "capi/frame/zombienet/examples/xcm/zombienet.toml/alice/@v0.9.36/mod.ts"
import {
  client as parachainClient,
  System,
} from "capi/frame/zombienet/examples/xcm/zombienet.toml/collator01/@v0.9.360/mod.ts"
import { alice, Rune } from "capi/mod.ts"

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

const teleportAssetsTx = XcmPallet.limitedTeleportAssets({
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
  .finalized()

// const aliceParachainBalance = () =>
//   System.Account.entry(alice.publicKey).read().access("value").access("data").access("free")

// const watchForDownwardMessagesProcessed = C.entryWatch(parachainClient)(
//   "System",
//   "Events",
//   [],
//   ({ end }) => {
//     return (entry: any) => {
//       for (const [_hash, events] of entry) {
//         if (!events) return
//         for (const { event } of events) {
//           if (
//             event.type === "ParachainSystem" && event.value.type === "DownwardMessagesProcessed"
//           ) {
//             return end(event)
//           }
//         }
//       }
//       return
//     }
//   },
// )

// const watchForDownwardMessagesProcessedPending = watchForDownwardMessagesProcessed.run()

// const watchForParachainBlocksPending = C.blockWatch(parachainClient)(({ end }) => {
//   let i = 0
//   return () => {
//     if (i === 1) {
//       return end()
//     }
//     i++
//     return
//   }
// }).run()

// console.log("Alice parachain balance before XcmPallet.limitedTeleportAssets")
// console.log(C.throwIfError(await aliceParachainBalance().run()))
// C.throwIfError(await teleportAssetsTx.run())
// console.log("waiting for parachain ParachainSystem.DownwardMessagesProcessed event")
// console.log(C.throwIfError(await watchForDownwardMessagesProcessedPending))
// console.log("waiting for parachain to start generating blocks")
// C.throwIfError(await watchForParachainBlocksPending)
// console.log("Alice parachain balance after XcmPallet.limitedTeleportAssets")
// console.log(C.throwIfError(await aliceParachainBalance().run()))
