import * as T from "../test_util/mod.ts"

import { extrinsic } from "../codegen/_output/westend/mod.ts"
import { Balances } from "../codegen/_output/westend/pallets/mod.ts"

const tx = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: T.bob.address,
  }),
})
  .feeEstimate

console.log(await tx.run())
