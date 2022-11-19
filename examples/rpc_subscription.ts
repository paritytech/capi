import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.chain.subscribeNewHeads(T.polkadot)([], (ctx) =>
  (header) => {
    console.log(header)
    const counter = ctx.state(U.Counter)
    if (counter.i === 2) {
      return ctx.end()
    }
    counter.inc()
    return
  })
U.throwIfError(await root.run())
