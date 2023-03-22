import { Staking } from "westend/mod.js"

const result = await Staking.ErasRewardPoints
  .value(
    Staking.ActiveEra
      .value()
      .unhandle(undefined)
      .access("index"),
  )
  .run()

console.log(result)
