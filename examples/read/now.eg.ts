/**
 * @title Current Agreed-Upon Time
 * @description Read the current timestamp as agreed upon by validators.
 */

import { polkadot } from "@capi/polkadot"
import { $, Scope } from "capi"

/// Retrieve the chain's current recorded time.
const now = await polkadot.Timestamp.Now.value().run(new Scope())

/// Ensure `now` is of the correct shape.
console.log("Now:", now)
$.assert($.u64, now)
