import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

const extrinsicsRaw = C.chain.getBlock(C.polkadot)()
  .access("block")
  .access("extrinsics")
const root = C.extrinsicsDecoded(T.polkadot, extrinsicsRaw)

console.log(U.throwIfError(await root.run()))
