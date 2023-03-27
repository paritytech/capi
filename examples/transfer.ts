import { Balances, users } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const { alexa, billy } = await users()

const result = await Balances
  .transfer({
    value: 12345n,
    dest: billy.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus()
  .finalizedEvents()
  .run()

console.log(result)
