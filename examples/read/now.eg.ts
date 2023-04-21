/**
 * @title Current Agreed-Upon Time
 * @stability nearing
 * @description Read the current timestamp as agreed upon by validators.
 */

import { chain } from "@capi/polkadot"
import { $ } from "capi"

/// Retrieve the chain's current recorded time.
const now = await chain.Timestamp.Now.value().run()

/// Ensure `now` is of the correct shape.
console.log("Now:", now)
$.assert($.u64, now)
