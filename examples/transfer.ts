import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

import { extrinsic } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.36/mod.ts"
import { Balances } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.36/pallets/mod.ts"

const tx = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: T.bob.address,
  }),
})
  .signed(T.alice.sign)

const finalizedIn = tx.watch(({ end }) => (status) => {
  console.log(status)
  if (typeof status !== "string" && status.finalized) {
    return end(status.finalized)
  } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
    return end(new NeverFinalized())
  }
  return
})

console.log(U.throwIfError(await C.events(tx, finalizedIn).run()))

class NeverFinalized extends Error {
  override readonly name = "NeverFinalizedError"
}
