import { alice } from "capi"
import { chain } from "polkadot_dev/mod.js"

const result = await chain
  .pallet("System")
  .storage("Account")
  .value(alice.publicKey)
  .run()

console.log(result)
