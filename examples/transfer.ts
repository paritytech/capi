import * as C from "capi/mod.ts"

import { Balances } from "westend_dev/mod.ts"

const tx = Balances.transfer({
  value: 12345n,
  dest: C.bob.address,
})
  .signed({ sender: C.alice })
  .sent
  .finalizedHash
  .unwrapError()

console.log(await tx.run())
// 4a7ad70 (update usage of rune in capi)
