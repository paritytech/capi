import * as U from "http://localhost:5646/@local/util/mod.ts"

import { System } from "http://localhost:5646/@local/proxy/dev:polkadot/@v0.9.36/pallets/mod.ts"

const root = System.Account.keys().readPage(10)

console.log(U.throwIfError(await root.run()))
