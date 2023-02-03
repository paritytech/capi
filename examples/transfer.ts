import * as C from "capi/mod.ts"
import { Balances } from "westend_dev/mod.ts"

const events = await Balances.transfer({
  value: 12345n,
  dest: C.bob.address,
})
  .signed({ sender: C.alice })
  .sent()
  .logStatus()
  .events()
  .run()

console.log(events)
