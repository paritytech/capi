/**
 * @title Smoldot Connection
 * @stability nearing
 * @description Smoldot enables users to run a tiny node in their browser,
 * such that they can connect directly to the network(s) without going through
 * a centralized intermediary. This is the future of unstoppable applications.
 * @test_skip
 * @todo get this exiting!
 */

import { chain } from "@capi/polkadot-dev"
import { $, known, SmoldotConnection } from "capi"

// Bring the chainspec into scope. Here, we'll import it from a local file.
import relayChainSpec from "./chainspec.json" assert { type: "json" }

// Initialize a `ChainRune` with `SmoldotConnection` and the chainspec.
const { block } = await chain
  .with(SmoldotConnection.bind({ relayChainSpec: JSON.stringify(relayChainSpec) }))
  .blockHash()
  .block()
  .run()

// Ensure the block is of the expected shape.
console.log(block)
$.assert(known.$block, block)
