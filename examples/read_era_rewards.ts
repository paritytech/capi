import { Rune } from "capi/mod.ts"
import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra.entry([]).access("index")
const eraRewardPoints = Staking.ErasRewardPoints.entry(Rune.tuple([idx]))

console.log(await eraRewardPoints.run())
