import { createUsers, System } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

const result = await System.Account
  .value(alexa.publicKey)
  .unhandle(undefined)
  .access("data", "free")
  .run()

console.log(result)
