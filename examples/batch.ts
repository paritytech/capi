import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, System, users, Utility } from "westend_dev/mod.js"

const [alexa, billy, carol, david] = await users(4)

const recipients = Object.entries({ billy, carol, david })

await balances().run()

const finalizedHash = await Utility
  .batch({
    calls: Rune.tuple(recipients.map(([, { address }]) =>
      Balances.transfer({
        dest: address,
        value: 3_000_000_123_456_789n,
      })
    )),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalizedHash()
  .run()

await balances(finalizedHash).run()

function balances(blockHash?: string) {
  return Rune
    .rec(Object.fromEntries(recipients.map(([name, { publicKey }]) => {
      const free = System.Account
        .value(publicKey, blockHash)
        .unhandle(undefined)
        .access("data", "free")
      return [name, free]
    })))
    .dbg("Balances:")
}
