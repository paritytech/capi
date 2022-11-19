import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryWatch(C.rococo)("System", "Events", [], (ctx) =>
  (entry) => {
    console.log(entry)
    const counter = ctx.state(U.Counter)
    if (counter.i === 2) {
      return ctx.end("HELLO")
    }
    counter.inc()
    return
  })

U.throwIfError(await root.run())
