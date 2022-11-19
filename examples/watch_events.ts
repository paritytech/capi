import * as C from "#capi/mod.ts"
import * as U from "#capi/util/mod.ts"

const root = C.entryWatch(C.rococo)("System", "Events", [], (ctx) => {
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

U.throwIfError(await root.run())
