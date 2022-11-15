import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryWatch(C.rococo)("System", "Events", [], function(entry) {
  console.log(entry)
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.end("HELLO")
  }
  counter.inc()
  return
})

U.throwIfError(await root.run())
