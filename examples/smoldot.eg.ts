/**
 * @title Smoldot Connection
 * @stability nearing
 * @description Smoldot enables users to run a tiny node in their browser,
 * such that they can connect directly to the network(s) without going through
 * a centralized intermediary. This is the future of unstoppable applications.
 */

import { chain } from "@capi/polkadot-dev"
import { $, known, SmoldotConnection } from "capi"

// Bring the chainspec(s) into scope. Here, we'll fetch it from the Smoldot GitHub repository.
const relayChainSpec = await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
).then((r) => r.text())

// Initialize a `ChainRune` with `SmoldotConnection` and the chainspec.
const { block } = await chain
  .with(SmoldotConnection.bind({ relayChainSpec }))
  .blockHash()
  .block()
  .run()

// Ensure the block is of the expected shape.
console.log(block)
$.assert(known.$block, block)
