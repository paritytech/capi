/**
 * @title Current Agreed-Upon Time
 * @stability nearing
 *
 * Read the current timestamp as agreed upon by validators.
 */

import { Timestamp } from "@capi/polkadot/mod.js"
import { $ } from "capi"

const now = await Timestamp.Now.value().run()
console.log("Now:", now)

// Ensure `now` is of the correct shape.
$.assert($.u64, now)
