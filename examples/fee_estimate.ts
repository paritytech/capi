import { Balances, createUsers } from "westend_dev/mod.js"

const { alexa } = await createUsers()

const result = await Balances
  .transfer({
    value: 12345n,
    dest: alexa.address,
  })
  .feeEstimate()
  .run()

console.log(result)
