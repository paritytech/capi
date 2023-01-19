import * as C from "../mod.ts"

import { Balances, extrinsic } from "westend_dev/mod.ts"

const tx = extrinsic({
  sender: C.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: C.bob.address,
  }),
}).feeEstimate

console.log(await tx.run())
