import { bob } from "capi/mod.ts"

import { Balances } from "westend_dev/mod.ts"

const tx = Balances.transfer({
  value: 12345n,
  dest: bob.address,
}).feeEstimate()

console.log(await tx.run())
