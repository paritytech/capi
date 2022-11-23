import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const extrinsicsRaw = C.chain.getBlock(C.polkadot)()
  .access("block")
  .access("extrinsics")
const root = C.extrinsicsDecoded(T.polkadot)(extrinsicsRaw)

console.log(U.throwIfError(await root.run()))
