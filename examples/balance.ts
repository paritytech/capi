import * as C from "capi/mod.ts"
import { System } from "polkadot_dev/mod.ts"

const result = await System.Account
  .entry([C.alice.publicKey])
  .run()

console.log(result)
