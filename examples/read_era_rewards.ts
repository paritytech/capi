import * as C from "../mod.ts"

import { ActiveEra, ErasRewardPoints } from "westend/Staking.ts"

const idx = ActiveEra.entry().read().access("value").access("index")

const eraRewardPoints = ErasRewardPoints.entry(idx).read()

console.log(C.throwIfError(await eraRewardPoints.run()))
