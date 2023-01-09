import * as C from "capi/mod.ts"

import { client } from "polkadot_dev/_/client.ts"

const root = C.entryWatch(client)("Timestamp", "Now", [], (ctx) => {
  let i = 0
  return (entry) => {
    console.log(entry)
    if (i === 2) {
      return ctx.end()
    }
    i++
    return
  }
})

C.throwIfError(await root.run())
