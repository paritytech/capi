/**
 * @title Raw RPC Subscription Usage
 * @description Interact directly with the RPC node's subscription methods.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { $, known } from "capi"

/// Get an async iterator, which yields subscription events.
const headerIter = polkadotDev.connection
  .subscribe("chain_subscribeFinalizedHeads", "chain_unsubscribeAllHeads")
  .iter()

/// Create a simple counter so that we can break iteration at 3.
let i = 0

/// Iterate over its items and ensure they conform to the expected shape.
for await (const header of headerIter) {
  $.assert(known.$header, header)
  console.log(header)
  i += 1
  if (i === 3) break
}
