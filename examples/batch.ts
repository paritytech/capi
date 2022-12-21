import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

import { extrinsic } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.31/mod.ts"
import {
  Balances,
  Utility,
} from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.31/pallets/mod.ts"

// TODO: uncomment these lines / use env upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// )

const tx = extrinsic({
  sender: T.alice.address,
  call: Utility.batchAll({
    calls: T.users.map((pair) =>
      Balances.transfer({
        dest: pair.address,
        value: 12345n,
      })
    ),
  }),
})
  .signed(T.alice.sign)
  .watch((ctx) => (status) => {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return ctx.end()
    }
    return
  })

U.throwIfError(await tx.run())
