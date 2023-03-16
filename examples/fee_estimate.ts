import { Balances, users } from "westend_dev/mod.js"

const [alexa] = await users(1)

const result = await Balances
  .transfer({
    value: 12345n,
    dest: alexa.address,
  })
  .feeEstimate()
  .run()

console.log(result)
