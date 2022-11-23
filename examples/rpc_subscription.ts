import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const root = C.chain.subscribeNewHeads(T.polkadot)([], (ctx) => {
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
U.throwIfError(await root.run())
