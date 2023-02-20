import { alice } from "capi"
import { chain } from "polkadot_dev/mod.ts"

const result = await chain
  .metadata()
  .pallet("System")
  .storage("Account")
  .entry([alice.publicKey])
  .run()

console.log(result)
