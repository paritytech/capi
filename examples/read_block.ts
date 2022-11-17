import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const extrinsicsRaw = C.chain.getBlock(C.polkadot)()
  .access("block")
  .access("extrinsics")
const root = C.extrinsicsDecoded(T.polkadot, extrinsicsRaw)

console.log(U.throwIfError(await root.run()))
