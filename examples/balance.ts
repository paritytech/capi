import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

import { System } from "../codegen/_output/polkadot/pallets/mod.ts"

const root = System.Account.entry(T.alice.publicKey).read()

console.log(U.throwIfError(await root.run()))
