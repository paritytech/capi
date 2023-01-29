import * as C from "capi/mod.ts"

import { nextUser, System } from "westend_dev/mod.ts"

const root = System.Account.entry(nextUser().publicKey).read()

console.log(C.throwIfError(await root.run()))
