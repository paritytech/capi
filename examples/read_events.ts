import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryRead(C.polkadot)("System", "Events", [])

console.log(U.throwIfError(await root.run()))
