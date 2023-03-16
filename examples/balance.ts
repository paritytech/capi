import { System, users } from "polkadot_dev/mod.js"

const [alexa] = await users(1)

const result = await System.Account.value(alexa.publicKey).run()

console.log(result)
