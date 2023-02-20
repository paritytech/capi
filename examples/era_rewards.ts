import { Rune } from "capi"
import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra.entry([]).access("index")

const result = await Staking.ErasRewardPoints
  .entry(Rune.tuple([idx.unhandle(undefined)]))
  .rehandle(undefined)
  .run()

console.log(result)
