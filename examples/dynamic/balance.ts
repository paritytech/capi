import { alice } from "capi"
import { client } from "polkadot_dev/mod.ts"

console.log(
  await client
    .metadata()
    .pallet("System")
    .storage("Account")
    .entry([alice.publicKey])
    .run(),
)
