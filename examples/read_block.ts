import * as C from "../mod.ts"

const root = C.extrinsicsDecoded(C.polkadot)(
  C.chain.getBlock(C.polkadot)()
    .access("block")
    .access("extrinsics"),
)

console.log(C.throwIfError(await root.run()))
