import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.chain.subscribeNewHeads(T.polkadot)([], function(header) {
  console.log(header)
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.end()
  }
  counter.inc()
  return
})
U.throwIfError(await root.run())
