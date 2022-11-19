import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.blockWatch(C.polkadot)((ctx) => {
  let i = 0
  return async ({ block }) => {
    const blockDecoded = await C.extrinsicsDecoded(C.polkadot, block.extrinsics).bind(ctx.env)()
    console.log(blockDecoded)
    if (i === 2) {
      return ctx.end()
    }
    i++
    return ctx.endIfError(blockDecoded)
  }
})

U.throwIfError(await root.run())
