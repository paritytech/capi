import * as C from "../mod.ts"

import * as Balances from "westend_dev/Balances.ts"
import { extrinsic } from "westend_dev/extrinsic.ts"

const tx = extrinsic({
  sender: C.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: C.bob.address,
  }),
})
  .signed(C.alice.sign)

const finalizedIn = tx.watch(({ end }) => (status) => {
  console.log(status)
  if (typeof status !== "string" && status.finalized) {
    return end(status.finalized)
  } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
    return end(new NeverFinalized())
  }
  return
})

console.log(C.throwIfError(await C.events(tx, finalizedIn).run()))

class NeverFinalized extends Error {
  override readonly name = "NeverFinalizedError"
}
