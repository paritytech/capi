import { alice, bob } from "capi"
import { Balances } from "westend_dev/mod.ts"

await Balances
  .transfer({
    value: 1_000_000_000_000_000_000_000_000_000_000_000_000n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .unhandleFailed()
  .run()
