import { chain, users } from "polkadot_dev/mod.js"

const [alice] = await users(1)

const result = await chain
  .pallet("System")
  .storage("Account")
  .value(alice.publicKey)
  .run()

console.log(result)
