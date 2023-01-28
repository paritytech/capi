import * as C from "capi/mod.ts"

import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra.entry().read().access("value").access("index")

const eraRewardPoints = Staking.ErasRewardPoints.entry(idx).read()

console.log(C.throwIfError(await eraRewardPoints.run()))
