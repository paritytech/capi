import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

import * as westend from "../codegen/_output/westend/mod.ts"

let hash: undefined | C.rpc.known.Hash

const env = C.Z.env()

const tx = C.extrinsic(T.westend)({
  sender: C.compat.multiAddressFromKeypair(T.alice),
  call: westend.pallets.Balances.transfer({
    value: 12345n,
    dest: C.compat.multiAddressFromKeypair(T.bob),
  }),
})
  .signed(C.compat.signerFromKeypair(T.alice))

const runTx = tx
  .watch(function(status) {
    console.log(status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      // TODO: return this upon implementing `this.stop`
      hash = (status as { finalized: C.rpc.known.Hash }).finalized
      this.stop()
    }
  })
  .bind(env)

const readEvents = C
  .events(tx, C.Z.call(() => hash!))
  .bind(env)

U.throwIfError(await runTx())
console.log(U.throwIfError(await readEvents()))
