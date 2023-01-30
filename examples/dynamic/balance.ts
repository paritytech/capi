import * as C from "capi/mod.ts"
import { client } from "polkadot_dev/mod.ts"

console.log(
  await client
    .metadata()
    .pallet("System")
    .storage("Account")
    .entry([C.alice.publicKey])
    .run(),
)
