import * as C from "http://localhost:5646/@local/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const ids = C.entryRead(C.polkadot)("Paras", "Parachains", [])
  .access("value")
  .as<number[]>()

const root = C.Z.each(ids, (id) => {
  return C.entryRead(C.polkadot)("Paras", "Heads", [id])
})

console.log(U.throwIfError(await root.run()))
