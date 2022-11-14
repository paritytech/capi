import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

const root = C.entryRead(C.polkadot.proxy)("System", "Events", [])

console.log(U.throwIfError(await root.run()))
