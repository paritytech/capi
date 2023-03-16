import { System, users } from "polkadot_dev/mod.js"

const [a] = await users(1)

const result = await System.Account.value(a.publicKey).run()

console.log(result)
