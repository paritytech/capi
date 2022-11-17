import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryWatch(T.polkadot)("Timestamp", "Now", [], function(entry) {
  console.log(entry)
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.stop()
  }
  counter.inc()
})

U.throwIfError(await root.run())
