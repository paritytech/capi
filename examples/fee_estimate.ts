import { bob } from "capi"
import { Balances } from "westend_dev/mod.js"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .feeEstimate()
  .run()

console.log(result)
