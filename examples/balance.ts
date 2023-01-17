import * as C from "capi/mod.ts"

import { client, System } from "polkadot_dev/mod.ts"

console.log(
  await client.metadata().pallet("System").storage("Account").entry([C.alice.publicKey]).run(),
)

const root = System.Account.entry([C.alice.publicKey])

console.log(await root.run())
