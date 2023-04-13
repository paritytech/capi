/**
 * @title Raw RPC Call Usage
 * @stability nearing
 * @description Interact directly with the RPC node's call methods.
 * @test_skip
 */

import { chain } from "@capi/polkadot-dev"
import { $ } from "capi"

// Make a call.
const hash = await chain.connection
  .call("chain_getFinalizedHead")
  .run()

// Ensure the result is a block hash.
$.assert($.str, hash)
console.log(hash)
