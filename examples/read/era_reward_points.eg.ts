/**
 * @title Read The Era Reward Points
 * @stability nearing
 * @description Model a derived read, in which one piece of storage (the staking
 * active era index)is used as the key to another piece of storage (the corresponding
 * reward points).
 */

import { $eraRewardPoints, westend } from "@capi/westend"
import { $, is, Scope } from "capi"

/// Reference the active era index.
const idx = westend.Staking.ActiveEra
  .value()
  .unhandle(is(undefined))
  .access("index")

/// Retrieve the reward points corresponding to `idx`.
const points = await westend.Staking.ErasRewardPoints.value(idx).run(new Scope())

/// Ensure the era reward points is of the correct shape.
console.log("Era reward points:", points)
$.assert($eraRewardPoints, points)
