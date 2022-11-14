import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"

const tx = C.extrinsic(T.westend)({
  sender: C.compat.multiAddressFromKeypair(T.alice),
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: C.compat.multiAddressFromKeypair(T.bob),
  },
})
  .feeEstimate

console.log(await tx.run())
