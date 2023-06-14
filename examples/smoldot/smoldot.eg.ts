/**
 * @title Smoldot Connection
 * @stability nearing
 * @description Smoldot enables users to run a tiny node in their browser,
 * such that they can connect directly to the network(s) without going through
 * a centralized intermediary. This is the future of unstoppable applications.
 */

import { PolkadotDevRune } from "@capi/polkadot-dev"
import { $, known, SmoldotConnection } from "capi"

/// Bring the chainspec into scope. Here, we'll import it from `fetch_chainspec.eg.ts`.
import { relayChainSpec } from "./fetch_chainspec.eg.ts"

/// Use the generate chain rune with `SmoldotConnection` and the chainspec.
const polkadot = PolkadotDevRune.from(SmoldotConnection.bind({ relayChainSpec }))

// Utilize the smoldot-connected `PolkadotRune` instance.
const { block } = await polkadot.blockHash().block().run()

/// Ensure the block is of the expected shape.
console.log(block)
$.assert(known.$block, block)
