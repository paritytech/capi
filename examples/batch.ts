import { alice, bob, charlie, dave, Rune } from "capi/mod.ts"
import { Balances, System, Utility } from "westend_dev/mod.ts"

const recipients = Rune.array([bob, charlie, dave])

const balances = recipients.mapArray((recipient) =>
  System.Account
    .entry(recipient.map((x) => [x.publicKey]))
    .access("data", "free")
)

console.log(await balances.run())

await Utility.batchAll({
  calls: recipients.mapArray((recipient) =>
    Balances.transfer({
      dest: recipient.access("address"),
      value: 12345n,
    })
  ),
})
  .signed({ sender: alice })
  .sent()
  .logEvents()
  .finalizedHash()
  .unwrapError()
  .run()

console.log(await balances.run())
