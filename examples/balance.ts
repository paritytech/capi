import * as C from "capi/mod.ts"

import { System } from "polkadot_dev/mod.ts"

const root = System.Account.entry(C.alice.publicKey).read()

console.log(C.throwIfError(await root.run()))
