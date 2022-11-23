import * as C from "http://localhost:5646/@local/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const idx = C.entryRead(C.westend)("Staking", "ActiveEra", [])
  .access("value")
  .access("index")

const eraRewardPoints = C.entryRead(C.westend)("Staking", "ErasRewardPoints", [idx])

console.log(U.throwIfError(await eraRewardPoints.run()))
