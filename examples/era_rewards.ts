import { Rune } from "capi"
import { Staking } from "westend/mod.ts"

const idx = Staking.ActiveEra.entry([]).access("index")

const result = await Staking.ErasRewardPoints
  .entry(
    idx
      .map((idx) => typeof idx === "number" ? [idx] as [number] : undefined)
      .unhandle(undefined),
  )
  .unhandle(undefined)
  .rehandle(undefined)
  .run()

console.log(result)
