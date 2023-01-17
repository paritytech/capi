import * as C from "capi/mod.ts"

import { Balances, Utility } from "westend_dev/mod.ts"

const recipients = C.Rune.ls([C.bob, C.charlie, C.dave])

// TODO: check balances after sending transaction
// const balances = recipients.mapArray((recipient) =>
//   System.Account.entry(recipient.pipe((x) => [x.publicKey])).pipe((x) => x.data.free)
// )

const tx = Utility.batchAll({
  calls: recipients.mapArray((recipient) =>
    Balances.transfer({
      dest: recipient.pipe((x) => x.address),
      value: 12345n,
    })
  ),
})
  .signed({ sender: C.alice })
  .sent
  .logEvents()
  .finalizedHash
  .unwrapError()

await tx.run()
