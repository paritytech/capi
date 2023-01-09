import * as C from "capi/mod.ts"

import { Balances, extrinsic, Utility } from "westend_dev/mod.ts"

// TODO: uncomment these lines / use env upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// )

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

U.throwIfError(await root.run())
