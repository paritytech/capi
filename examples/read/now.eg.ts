/**
 * @title Current Agreed-Upon Time
 * @stability nearing
 *
 * Read the current timestamp as agreed upon by validators.
 */

import { $ } from "capi"
import { Timestamp } from "polkadot/mod.js"

const now = await Timestamp.Now.value().run()

$.assert($.u32, now)
