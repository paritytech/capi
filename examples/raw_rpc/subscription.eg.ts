/**
 * @title Raw RPC Subscription Usage
 * @stability nearing
 * @description Interact directly with the RPC node's subscription methods.
 */

import { chain } from "@capi/polkadot-dev/mod.js"
import { $, known } from "capi"

// Get an async iterator, which yields subscription events.
const headerIter = chain.connection
  .subscribe("chain_subscribeFinalizedHeads", "chain_unsubscribeAllHeads")
  .iter()

let count = 0
// Iterate over its items and ensure they conform to the expected shape.
for await (const header of headerIter) {
  $.assert(known.$header, header)
  console.log(header)
  count += 1
  if (count === 3) break
}
