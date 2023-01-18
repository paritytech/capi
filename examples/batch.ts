import { alice, ArrayRune, bob, charlie, dave, Rune } from "capi/mod.ts"

import { Balances, Utility } from "westend_dev/mod.ts"

const recipients = Rune.ls([bob, charlie, dave]).as(ArrayRune)

// TODO: check balances after sending transaction
// const balances = recipients.mapArray((recipient) =>
//   System.Account.entry(recipient.map((x) => [x.publicKey])).access("data", "free")
// )

const tx = Utility.batchAll({
  calls: recipients.mapArray((recipient) =>
    Balances.transfer({
      dest: recipient.access("address"),
      value: 12345n,
    })
  ),
})
  .signed({ sender: alice })
  .sent
  .logEvents()
  .finalizedHash
  .unwrapError()

await tx.run()
