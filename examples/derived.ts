import * as C from "http://localhost:5646/@local/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

// TODO: uncomment these lines to run a single effect upon solving `count` in zones
// or effects/rpc.ts#discardCheck
// const ids = C.entryRead(C.polkadot)("Paras", "Parachains", [])
//   .access("value")
//   .as<number[]>()

const ids = U.throwIfError(
  await C.entryRead(C.polkadot)("Paras", "Parachains", [])
    .access("value")
    .as<number[]>()
    .run(),
)

const root = C.Z.each(ids, (id) => {
  return C.entryRead(C.polkadot)("Paras", "Heads", [id])
})

console.log(U.throwIfError(await root.run()))
