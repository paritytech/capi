import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

import { extrinsic } from "../codegen/_output/westend/mod.ts"
import { Balances, Utility } from "../codegen/_output/westend/pallets/mod.ts"

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
  .watch(function(status) {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      this.stop()
    }
  })

U.throwIfError(await tx.run())
