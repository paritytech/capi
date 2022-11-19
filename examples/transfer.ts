import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

import { extrinsic } from "#capi/proxy/dev:westend/@v0.9.31/mod.ts"
import { Balances } from "#capi/proxy/dev:westend/@v0.9.31/pallets/mod.ts"

const ex = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: T.bob.address,
  }),
})
  .signed(T.alice.sign)

const finalizedIn = ex.watch(({ end }) =>
  (status) => {
    console.log(status)
    if (typeof status !== "string" && status.finalized) {
      return end(status.finalized)
    } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return end(new NeverFinalized())
    }
    return
  }
)

console.log(U.throwIfError(await C.events(ex, finalizedIn).run()))

class NeverFinalized extends Error {
  override readonly name = "NeverFinalizedError"
}
