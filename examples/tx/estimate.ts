/**
 * @title Estimate
 * @stability nearing
 * @description Get the timepoint and estimate the fee of a tx.
 */

import { $weight, westend } from "@capi/westend"
import { $, alice, Rune } from "capi"

/// Create the call data.
const call = westend.Balances
  .transfer({
    value: 12345n,
    dest: alice.address,
  })

/// Gather the weight and estimate.
const collection = await Rune
  .object({
    weight: call.weight(),
    estimate: call.estimate(),
  })
  .run()

/// Ensure the data is of the expected shape
console.log(collection)
$.assert(
  $.object(
    $.field("weight", $weight),
    $.field("estimate", $.u128),
  ),
  collection,
)
