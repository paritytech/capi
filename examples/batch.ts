import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

import * as westend from "../codegen/_output/westend/mod.ts"
import MultiAddress = westend.sp_runtime.multiaddress.MultiAddress
import MultiSignature = westend.sp_runtime.MultiSignature

// TODO: uncomment these lines / use env upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// )

const tx = C.extrinsic(T.westend)({
  sender: C.compat.multiAddressFromKeypair(T.alice),
  call: westend.Utility.batch_all({
    calls: T.users.map((pair) =>
      westend.Balances.transfer({
        dest: C.compat.multiAddressFromKeypair(pair),
        value: 12345n,
      })
    ),
  }),
})
  .signed(C.compat.signerFromKeypair(T.alice))
  .watch(function(status) {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      this.stop()
    }
  })

U.throwIfError(await tx.run())
