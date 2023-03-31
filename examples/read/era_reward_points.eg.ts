/**
 * @title Read The Era Reward Points
 * @stability nearing
 *
 * Model a derived read, in which one piece of storage (the staking active era index)
 * is used as the key to another piece of storage (the corresponding reward points).
 */

import { $ } from "capi"
import { Staking, types } from "westend/mod.js"

const idx = Staking.ActiveEra
  .value()
  .unhandle(undefined)
  .access("index")

const points = await Staking.ErasRewardPoints.value(idx).run()

$.assert(types.pallet_staking.$eraRewardPoints, points)
