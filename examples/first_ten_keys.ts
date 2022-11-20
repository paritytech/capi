import * as U from "#capi/util/mod.ts"

import { System } from "#capi/proxy/dev:polkadot/@v0.9.31/pallets/mod.ts"

const root = System.Account.keys().readPage(10)

console.log(U.throwIfError(await root.run()))
