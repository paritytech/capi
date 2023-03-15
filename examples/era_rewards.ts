import { Staking } from "westend/mod.js"

const idx = Staking.ActiveEra.value().unhandle(undefined).access("index")

const result = await Staking.ErasRewardPoints.value(idx).run()

console.log(result)
