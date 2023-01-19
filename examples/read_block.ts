import * as C from "../mod.ts"

import { client } from "polkadot/mod.ts"

const root = C.extrinsicsDecoded(client)(
  C.chain.getBlock(client)().access("block").access("extrinsics"),
)

console.log(C.throwIfError(await root.run()))
