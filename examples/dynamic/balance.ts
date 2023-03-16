import { chain, users } from "polkadot_dev/mod.js"

const [alexa] = await users(1)

const result = await chain
  .pallet("System")
  .storage("Account")
  .value(alexa.publicKey)
  .run()

console.log(result)
