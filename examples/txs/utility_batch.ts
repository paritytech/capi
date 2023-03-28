import { Rune } from "capi"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, createUsers, System, Utility } from "westend_dev/mod.js"

const [sender, ...recipients] = await createUsers(4)

const balances = Rune.tuple(
  recipients.map(({ publicKey }) =>
    System.Account.value(publicKey).unhandle(undefined).access("data", "free")
  ),
)

console.log("Initial balances:", await balances.run())

await Utility
  .batch({
    calls: Rune.tuple(recipients.map(({ address }) =>
      Balances.transfer({
        dest: address,
        value: 3_000_000_123_456_789n,
      })
    )),
  })
  .signed(signature({ sender }))
  .sent()
  .dbgStatus()
  .finalized()
  .run()

console.log("Final balances:", await balances.run())
