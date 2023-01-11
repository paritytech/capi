import * as C from "../mod.ts"

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

C.throwIfError(await root.run())
