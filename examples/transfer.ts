import { Balances, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [alice, bob] = await users(2)

const result = await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
