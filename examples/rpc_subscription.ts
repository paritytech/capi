import * as C from "capi/mod.ts"

const root = C.chain.subscribeNewHeads(C.polkadot)([], (ctx) => {
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
