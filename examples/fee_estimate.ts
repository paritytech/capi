import { bob } from "capi/mod.ts"
import { Balances } from "westend_dev/mod.ts"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .feeEstimate()
  .run()

console.log(result)
