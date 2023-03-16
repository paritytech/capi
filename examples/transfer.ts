import { Balances, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const [a, b] = await users(2)

const result = await Balances
  .transfer({
    value: 12345n,
    dest: b.address,
  })
  .signed(signature({ sender: a }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
