/**
 * @title Raw RPC Usage
 * @stability stable
 * @description Interact directly with the RPC node's methods.
 */
import { chain } from "polkadot_dev/mod.js"
import * as $ from "../deps/scale.ts"

const hash = await chain.connection
  .call("chain_getFinalizedHead")
  .run()

console.log(raw)
$.assert($.str, hash)
