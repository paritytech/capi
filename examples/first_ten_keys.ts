import * as U from "../util/mod.ts"

import { System } from "../codegen/_output/polkadot/pallets/mod.ts"

const root = System.Account.keys().readPage(10)

console.log(U.throwIfError(await root.run()))
