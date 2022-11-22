import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

import { System } from "#capi/proxy/dev:polkadot/@v0.9.31/pallets/mod.ts"

const root = System.Account.entry(T.alice.publicKey).read()

console.log(U.throwIfError(await root.run()))
