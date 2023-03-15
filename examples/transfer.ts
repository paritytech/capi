import { alice, bob } from "capi"
import { Balances } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
