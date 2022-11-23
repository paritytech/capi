import * as C from "http://localhost:5646/@local/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

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
