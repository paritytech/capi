/**
 * @title Read Some Era Exposures
 * @description Model a derived read, in which one piece of storage (the staking
 * active era index) is used as a partial key to get a list of exposures.
 */

import { $accountId32, $exposure, polkadotDev } from "@capi/polkadot-dev"
import { $, is, Rune } from "capi"

/// Reference the active era index.
const idx = polkadotDev.Staking.ActiveEra
  .value()
  .unhandle(is(undefined))
  .access("index")

/// Retrieve the era's stakers corresponding to `idx`.
const exposures = await polkadotDev.Staking.ErasStakers
  .entries({ partialKey: Rune.tuple([idx]) })
  .run()

/// Ensure `exposures` is of the correct shape.
console.log("Exposures:", exposures)
$.assert($.array($.tuple($.tuple($.u8, $accountId32), $exposure)), exposures)
