import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.blockWatch(C.polkadot)(async function blockWatchListener({ block }) {
  const extrinsicsDecoded = C
    .extrinsicsDecoded(C.polkadot, block.extrinsics)
    .bind(this.env)
  console.log(await extrinsicsDecoded())
  const counter = this.state(U.Counter)
  if (counter.i === 2) {
    return this.end("HELLO")
  }
  counter.inc()
  return
})

U.throwIfError(await root.run())
