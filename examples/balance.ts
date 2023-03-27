import { System, users } from "polkadot_dev/mod.js"

const { alexa } = await users()

const result = await System.Account.value(alexa.publicKey).run()

console.log(result)
