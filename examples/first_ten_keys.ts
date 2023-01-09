import * as C from "capi/mod.ts"

import * as System from "polkadot_dev/System.ts"

const root = System.Account.keys().readPage(10)

console.log(C.throwIfError(await root.run()))
