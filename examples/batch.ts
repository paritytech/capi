import * as C from "../mod.ts"

import { Balances, extrinsic, Utility } from "westend_dev/mod.ts"

const tx = extrinsic({
  sender: C.alice.address,
  call: Utility.batchAll({
    calls: [C.alice, C.bob, C.charlie]
      .map(({ address: dest }) => Balances.transfer({ dest, value: 12345n })),
  }),
})
  .signed(C.alice.sign)
  .watch((ctx) => (status) => {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return ctx.end()
    }
    return
  })

C.throwIfError(await tx.run())
