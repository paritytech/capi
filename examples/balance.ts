import * as C from "capi/mod.ts"

import { System } from "rococo_dev/mod.ts"

console.log({ ss58Prefix: System.SS58Prefix })

const root = System.Account.keys().readPage(200)

// should be 112 when working
console.log(C.throwIfError(await root.run()).length)
