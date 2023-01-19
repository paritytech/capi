import * as C from "../mod.ts"

import { client } from "polkadot/mod.ts"

const extrinsicsDecoded = C.extrinsicsDecoded(client)

const root = C.blockWatch(client)((ctx) => {
  let i = 0
  return async ({ block }) => {
    const blockDecoded = await extrinsicsDecoded(block.extrinsics).bind(ctx.env)()
    console.log(blockDecoded)
    if (i === 2) {
      return ctx.end()
    }
    i++
    return ctx.endIfError(blockDecoded)
  }
})

C.throwIfError(await root.run())
