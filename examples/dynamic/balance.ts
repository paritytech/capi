import { chain, users } from "polkadot_dev/mod.js"

const [a] = await users(1)

const result = await chain
  .pallet("System")
  .storage("Account")
  .value(a.publicKey)
  .run()

console.log(result)
