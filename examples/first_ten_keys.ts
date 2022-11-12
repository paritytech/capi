import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

const root = C.keyPageRead(T.polkadot)("System", "Account", 10, [])

console.log(U.throwIfError(await root.run()))
