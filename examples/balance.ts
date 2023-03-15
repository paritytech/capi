import { System, users } from "polkadot_dev/mod.js"

const [alice] = await users(1)

const result = await System.Account.value(alice.publicKey).run()

console.log(result)
