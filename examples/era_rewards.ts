import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra.unhandle(undefined).access("index")

const result = await Staking.ErasRewardPoints.value(idx).run()

console.log(result)
