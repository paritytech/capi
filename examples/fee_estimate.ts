import { Balances, users } from "westend_dev/mod.js"

const [alice] = await users(1)

const result = await Balances
  .transfer({
    value: 12345n,
    dest: alice.address,
  })
  .feeEstimate()
  .run()

console.log(result)
