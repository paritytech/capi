import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

import { extrinsic } from "http://localhost:5646/@local/proxy/ws:127.0.0.1:53906/@v0.9.31/mod.ts"
import { XcmPallet } from "http://localhost:5646/@local/proxy/ws:127.0.0.1:53906/@v0.9.31/pallets/mod.ts"
import { System } from "http://localhost:5646/@local/proxy/ws:127.0.0.1:53914/@v0.9.300/pallets/mod.ts"

const teleportAssets = extrinsic({
  sender: T.alice.address,
  call: XcmPallet.limitedTeleportAssets({
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
            id: T.alice.address.value,
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
  }),
})
  .signed(T.alice.sign)

const finalizedIn = teleportAssets.watch(({ end }) =>
  (status) => {
    if (typeof status !== "string" && status.finalized) {
      return end(status.finalized)
    } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return end(new Error())
    }
    return
  }
)

const aliceParachainBalance = System.Account.entry(T.alice.publicKey).read()

const watchForDownwardMessagesProcessed = C.entryWatch(System.Account.client)(
  "System",
  "Events",
  [],
  (ctx) => {
    return (entry: any) => {
      for (const [_hash, events] of entry) {
        for (const { event } of events) {
          if (
            event.type === "ParachainSystem" && event.value.type === "DownwardMessagesProcessed"
          ) {
            return ctx.end(event)
          }
        }
      }
      return
    }
  },
)

const watchForDownwardMessagesProcessedPending = watchForDownwardMessagesProcessed.run()

console.log("Alice parachain balance before limitedTeleportAssets")
console.log(U.throwIfError(await aliceParachainBalance.run()))
console.log(U.throwIfError(await C.events(teleportAssets, finalizedIn).run()))
console.log(await watchForDownwardMessagesProcessedPending)
console.log("Alice parachain balance after limitedTeleportAssets")
console.log(U.throwIfError(await aliceParachainBalance.run()))
