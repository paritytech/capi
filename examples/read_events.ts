import * as C from "../mod.ts"

const root = C.entryRead(C.polkadot)("System", "Events", [])

console.log(C.throwIfError(await root.run()))
