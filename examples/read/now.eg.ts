/**
 * @title Current Agreed-Upon Time
 * @stability nearing
 * @description Read the current timestamp as agreed upon by validators.
 */

import { Polkadot } from "@capi/polkadot"
import { $ } from "capi"

/// Retrieve the chain's current recorded time.
const now = await Polkadot.Timestamp.Now.value().run()

/// Ensure `now` is of the correct shape.
console.log("Now:", now)
$.assert($.u64, now)
