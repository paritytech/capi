import * as C from "../mod.ts"

import { client as relayChainClient } from "http://localhost:8000/zombienet/examples/xcm_teleport_assets.toml/alice@v9.36.0/_/client.ts"
import { client as parachainClient } from "http://localhost:8000/zombienet/examples/xcm_teleport_assets.toml/collator01@v9.36.0/_/client.ts"

const teleportAssetsTx = C.extrinsic(relayChainClient)({
  sender: C.alice.address,
  call: {
    type: "XcmPallet",
    value: {
      type: "limitedTeleportAssets",
      dest: {
        type: "V1",
        value: {
          parents: 0,
          interior: {
            type: "X1",
            value: {
              type: "Parachain",
              value: 1000,
            },
          },
        },
      },
      beneficiary: {
        type: "V1",
        value: {
          parents: 0,
          interior: {
            type: "X1",
            value: {
              type: "AccountId32",
              id: C.alice.address.value,
              network: {
                type: "Any",
              },
            },
          },
        },
      },
      assets: {
        type: "V1",
        value: [{
          id: {
            type: "Concrete",
            value: {
              parents: 0,
              interior: {
                type: "Here",
              },
            },
          },
          fun: {
            type: "Fungible",
            value: 500_000_000_000_000n,
          },
        }],
      },
      feeAssetItem: 0,
      weightLimit: {
        type: "Unlimited",
      },
    },
  },
})
  .signed(C.alice.sign)
  .watch(({ end }) => {
    return (status) => {
      console.log(status)
      if (typeof status !== "string" && status.finalized) {
        return end(status.finalized)
      } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        return end(new Error())
      }
      return
    }
  })

const aliceParachainBalance = () =>
  C.entryRead(parachainClient)("System", "Account", [C.alice.publicKey])
    .access("value")
    .access("data")
    .access("free")

const watchForDownwardMessagesProcessed = C.entryWatch(parachainClient)(
  "System",
  "Events",
  [],
  ({ end }) => {
    return (entry: any) => {
      for (const [_hash, events] of entry) {
        if (!events) return
        for (const { event } of events) {
          if (
            event.type === "ParachainSystem" && event.value.type === "DownwardMessagesProcessed"
          ) {
            return end(event)
          }
        }
      }
      return
    }
  },
)

const watchForDownwardMessagesProcessedPending = watchForDownwardMessagesProcessed.run()

const watchForParachainBlocksPending = C.blockWatch(parachainClient)(({ end }) => {
  let i = 0
  return () => {
    if (i === 1) {
      return end()
    }
    i++
    return
  }
}).run()

console.log("Alice parachain balance before XcmPallet.limitedTeleportAssets")
console.log(C.throwIfError(await aliceParachainBalance().run()))
C.throwIfError(await teleportAssetsTx.run())
console.log("waiting for parachain ParachainSystem.DownwardMessagesProcessed event")
console.log(C.throwIfError(await watchForDownwardMessagesProcessedPending))
console.log("waiting for parachain to start generating blocks")
C.throwIfError(await watchForParachainBlocksPending)
console.log("Alice parachain balance after XcmPallet.limitedTeleportAssets")
console.log(C.throwIfError(await aliceParachainBalance().run()))
