import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.blockWatch(C.polkadot)((ctx) =>
  async ({ block }) => {
    const extrinsicsDecoded = C
      .extrinsicsDecoded(C.polkadot, block.extrinsics)
      .bind(ctx.env)
    console.log(await extrinsicsDecoded())
    const counter = ctx.state(U.Counter)
    if (counter.i === 2) {
      return ctx.end("HELLO")
    }
    counter.inc()
    return
  }
)

U.throwIfError(await root.run())
