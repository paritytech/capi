import * as T from "http://localhost:5646/@local/test_util/mod.ts"

import { extrinsic } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.31/mod.ts"
import { Balances } from "http://localhost:5646/@local/proxy/dev:westend/@v0.9.31/pallets/mod.ts"

const tx = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 12345n,
    dest: T.bob.address,
  }),
})
  .feeEstimate

console.log(await tx.run())
