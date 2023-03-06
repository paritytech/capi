import { alice, bob, Rune } from "capi"
import { Balances } from "westend_dev/mod.ts"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
