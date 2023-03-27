import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, System, users, Utility } from "westend_dev/mod.js"
import { mapEntries } from "../deps/std/collections/map_entries.ts"

const [alexa, billy, carol, david] = await users(4)

const balances = Rune.rec(
  mapEntries({ billy, carol, david }, ([name, { publicKey }]) => {
    const balance = System.Account
      .value(publicKey)
      .unhandle(undefined)
      .access("data", "free")
    return [name, balance]
  }),
)

console.log("Initial balances:", await balances.run())

await Utility
  .batch({
    calls: Rune.tuple([billy, carol, david].map(({ address }) =>
      Balances.transfer({
        dest: address,
        value: 3_000_000_123_456_789n,
      })
    )),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Batch tx:")
  .finalized()
  .run()

console.log("Final balances:", await balances.run())
