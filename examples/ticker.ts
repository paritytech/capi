import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryWatch(T.polkadot)("Timestamp", "Now", [], (ctx) =>
  (entry) => {
    console.log(entry)
    const counter = ctx.state(U.Counter)
    if (counter.i === 2) {
      return ctx.end()
    }
    counter.inc()
    return
  })

U.throwIfError(await root.run())
