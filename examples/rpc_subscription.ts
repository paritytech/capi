import * as C from "capi/mod.ts"

import { client } from "polkadot/mod.ts"

const root = C.chain.subscribeNewHeads(client)([], (ctx) => {
  let i = 0
  return (header) => {
    console.log(header)
    if (i === 2) {
      return ctx.end()
    }
    i++
    return
  }
})
C.throwIfError(await root.run())
