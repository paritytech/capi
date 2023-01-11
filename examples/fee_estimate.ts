import * as C from "../mod.ts"

import * as Balances from "westend_dev/Balances.ts"
import { extrinsic } from "westend_dev/extrinsic.ts"

const tx = extrinsic({
  sender: C.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: C.bob.address,
  }),
})
  .feeEstimate

console.log(await tx.run())
