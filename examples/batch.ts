import * as C from "http://localhost:8000/mod.ts"
import * as U from "http://localhost:8000/util/mod.ts"

import { extrinsic } from "http://localhost:8000/dev/westend/@v0.9.36/mod.ts"
import { Balances, Utility } from "http://localhost:8000/dev/westend/@v0.9.36/pallets/mod.ts"

// TODO: uncomment these lines / use env upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// )

const tx = extrinsic({
  sender: U.alice.address,
  call: Utility.batchAll({
    calls: [U.alice, U.bob, U.charlie]
      .map(({ address: dest }) => Balances.transfer({ dest, value: 12345n })),
  }),
})
  .signed(U.alice.sign)
  .watch((ctx) => (status) => {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return ctx.end()
    }
    return
  })

U.throwIfError(await root.run())
