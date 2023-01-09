import * as C from "capi/mod.ts"

const extrinsicsRaw = C.chain.getBlock(C.polkadot)()
  .access("block")
  .access("extrinsics")
const root = C.extrinsicsDecoded(C.polkadot)(extrinsicsRaw)

console.log(C.throwIfError(await root.run()))
