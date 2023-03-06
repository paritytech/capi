import { alice } from "capi"
import { chain } from "polkadot_dev/mod.ts"

const result = await chain
  .pallet("System")
  .storage("Account")
  .value(alice.publicKey)
  .run()

console.log(result)
