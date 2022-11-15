import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

import { extrinsic } from "#capi/proxy/dev:westend/@v0.9.31/mod.ts"
import { Balances } from "#capi/proxy/dev:westend/@v0.9.31/pallets/mod.ts"

let hash: undefined | C.rpc.known.Hash

const env = C.Z.env()

const tx = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: T.bob.address,
  }),
})
  .signed(T.alice.sign)

const runTx = tx
  .watch(function(status) {
    if (typeof status !== "string" && status.finalized) {
      return this.end(status.finalized)
    } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      return this.end(new NeverFinalized())
    }
    return
  })
  .bind(env)

const readEvents = C
  .events(tx, C.Z.call(() => hash!))
  .bind(env)

U.throwIfError(await runTx())
console.log(U.throwIfError(await readEvents()))

class NeverFinalized extends Error {
  override readonly name = "NeverFinalizedError"
}
