import * as C from "capi/mod.ts"

import * as System from "polkadot_dev/System.ts"

const root = System.Account.entry(C.alice.publicKey).read()

console.log(C.throwIfError(await root.run()))
