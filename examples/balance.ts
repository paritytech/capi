import { alice } from "capi"
import { System } from "polkadot_dev/mod.ts"

const result = await System.Account.entry([alice.publicKey]).run()

console.log(result)
