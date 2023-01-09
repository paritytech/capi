import * as C from "capi/mod.ts"

const extrinsicsDecoded = C.extrinsicsDecoded(C.polkadot)

const root = C.blockWatch(C.polkadot)((ctx) => {
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
