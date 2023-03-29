import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, createUsers } from "westend_dev/mod.js"

const { alexa, billy } = await createUsers()

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
