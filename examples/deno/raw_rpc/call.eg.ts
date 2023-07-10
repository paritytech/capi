/**
 * @title Raw RPC Call Usage
 * @description Interact directly with the RPC node's call methods.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { $ } from "capi"

/// Make a call.
const hash = await polkadotDev.connection
  .call("chain_getFinalizedHead")
  .run()

/// Ensure the result is a block hash.
$.assert($.str, hash)
console.log(hash)
