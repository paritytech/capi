import { alice, bob } from "capi"
import { Balances } from "westend_dev/mod.ts"

console.log(
  await Balances
    .transfer({
      value: 12345n,
      dest: bob.address,
    })
    .signed({ sender: alice })
    .sent()
    .logStatus()
    .events()
    .run(),
)
