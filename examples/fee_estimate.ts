import { Balances, users } from "westend_dev/mod.js"

const [a] = await users(1)

const result = await Balances
  .transfer({
    value: 12345n,
    dest: a.address,
  })
  .feeEstimate()
  .run()

console.log(result)
