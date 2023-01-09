import * as C from "capi/mod.ts"

const idx = C.entryRead(C.westend)("Staking", "ActiveEra", [])
  .access("value")
  .access("index")

const eraRewardPoints = C.entryRead(C.westend)("Staking", "ErasRewardPoints", [idx])

console.log(C.throwIfError(await eraRewardPoints.run()))
