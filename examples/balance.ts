import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

const root = C.entryRead(T.polkadot)("System", "Account", [T.alice.publicKey])

console.log(U.throwIfError(await root.run()))
