import * as C from "capi"
import { Balances } from "westend_dev/mod.ts"

const tx = Balances
  .transfer({
    value: 12345n,
    dest: C.bob.address,
  })
  .signed({ sender: C.alice })

const txFinalizedBlockHash = tx
  .sent()
  .logStatus()
  .finalized()

const result = await txFinalizedBlockHash.txEvents(tx.hex()).run()

console.log(result)
