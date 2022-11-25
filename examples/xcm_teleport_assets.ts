import * as path from "http://localhost:5646/@local/deps/std/path.ts"
import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const configFile = path.join(
  path.dirname(path.fromFileUrl(import.meta.url)),
  "xcm_teleport_assets.toml",
)
const zombienet = await T.zombienet.start(configFile)

console.log(
  "Alice node",
  `https://polkadot.js.org/apps/?rpc=${zombienet.config.nodesByName["alice"].wsUri}#/explorer`,
)
console.log(
  "collator01 node",
  `https://polkadot.js.org/apps/?rpc=${zombienet.config.nodesByName["collator01"].wsUri}#/explorer`,
)

Deno.addSignalListener("SIGINT", async () => {
  try {
    await zombienet.close()
  } finally {
    Deno.exit()
  }
})

// see xcm_teleport_asset.toml for node names
const relaychainClient = zombienet.clients.byName["alice"]!
const parachainClient = zombienet.clients.byName["collator01"]!

const teleportAssetsTx = C.extrinsic(relaychainClient)({
  sender: T.alice.address,
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
    },
  },
})
  .signed(T.alice.sign)
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
  C.entryRead(parachainClient)("System", "Account", [T.alice.publicKey])
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

const watchForParachainBlocksPending = C.blockWatch(parachainClient)(
  ({ end }) => {
    let i = 0
    return () => {
      if (i === 1) {
        return end()
      }
      i++
      return
    }
  },
).run()

console.log("Alice parachain balance before XcmPallet.limitedTeleportAssets")
console.log(U.throwIfError(await aliceParachainBalance().run()))
U.throwIfError(await teleportAssetsTx.run())
console.log("waiting for parachain ParachainSystem.DownwardMessagesProcessed event")
console.log(U.throwIfError(await watchForDownwardMessagesProcessedPending))
console.log("waiting for parachain to start generating blocks")
U.throwIfError(await watchForParachainBlocksPending)
console.log("Alice parachain balance after XcmPallet.limitedTeleportAssets")
console.log(U.throwIfError(await aliceParachainBalance().run()))

await zombienet.close()
