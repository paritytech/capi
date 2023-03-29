import { createUsers, System } from "polkadot_dev/mod.js"

const { alexa } = await createUsers()

const result = await System.Account.value(alexa.publicKey).run()

console.log(result)
