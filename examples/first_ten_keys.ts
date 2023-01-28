import * as C from "capi/mod.ts"

import { System } from "polkadot_dev/mod.ts"

const root = System.Account.keys().readPage(10)

console.log(C.throwIfError(await root.run()))
