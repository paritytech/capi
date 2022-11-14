import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

const ids = C.entryRead(C.polkadot.proxy)("Paras", "Parachains", [])
  .access("value")
  .as<number[]>()

const root = C.Z.each(ids, (id) => {
  return C.entryRead(C.polkadot.proxy)("Paras", "Heads", [id])
})

console.log(U.throwIfError(await root.run()))
