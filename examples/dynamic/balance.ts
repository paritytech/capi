import { alice } from "capi"
import { client } from "polkadot_dev/mod.ts"

const result = await client
  .metadata()
  .pallet("System")
  .storage("Account")
  .entry([alice.publicKey])
  .run()

console.log(result)
