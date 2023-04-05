/**
 * @title Raw RPC Call Usage
 * @stability nearing
 * @description Interact directly with the RPC node's call methods.
 */

import { $ } from "capi"
import { chain } from "polkadot_dev/mod.js"

// Make a call.
const hash = await chain.connection
  .call("chain_getFinalizedHead")
  .run()

// Ensure the result is a block hash.
console.log(hash)
$.assert($.str, hash)
