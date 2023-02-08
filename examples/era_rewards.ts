import { Rune } from "capi"
import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra
  .entry([])
  .access("index")

const result = await Staking.ErasRewardPoints
  .entry(Rune.tuple([idx]))
  .run()

console.log(result)
