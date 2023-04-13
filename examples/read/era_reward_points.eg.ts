/**
 * @title Read The Era Reward Points
 * @stability nearing
 * @description Model a derived read, in which one piece of storage (the staking
 * active era index)is used as the key to another piece of storage (the corresponding
 * reward points).
 * @test_skip
 */

import { $eraRewardPoints, Staking } from "@capi/westend"
import { $ } from "capi"

const idx = Staking.ActiveEra
  .value()
  .unhandle(undefined)
  .access("index")

const points = await Staking.ErasRewardPoints.value(idx).run()
console.log("Era reward points:", points)

// Ensure the era reward points is of the correct shape.
$.assert($eraRewardPoints, points)
