import { alice, bob } from "capi"
import { Balances } from "westend_dev/mod.ts"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus()
  .txEvents()
  .run()

console.log(result)
