import { alice } from "capi"
import { System } from "polkadot_dev/mod.ts"

const result = await System.Account.value(alice.publicKey).run()

console.log(result)
