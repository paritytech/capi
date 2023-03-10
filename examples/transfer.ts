import { alice, bob } from "capi"
import { Balances, chain } from "westend_dev/mod.ts"
import { signature } from "../patterns/signature/polkadot.ts"

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed(signature(chain, { sender: alice }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
