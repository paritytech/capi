import { alice, bob } from "capi"
import { Balances } from "westend_dev/mod.ts"

const tx = Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })

const txFinalizedBlock = tx
  .sent()
  .logStatus()
  .finalized()

const result = await txFinalizedBlock
  .txEvents(tx.hex())
  .run()

console.log(result)
