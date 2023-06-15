/**
 * @title Smoldot Connection
 * @description Smoldot enables users to run a tiny node in their browser,
 * such that they can connect directly to the network(s) without going through
 * a centralized intermediary. This is the future of unstoppable applications.
 * @note We'll soon rework all of Capi to be smoldot-first, at which point
 * every example will be a smoldot example. The API may change.
 * See https://github.com/paritytech/capi/issues/1077
 */

import { PolkadotRune } from "@capi/polkadot"
import { $, known, Scope, SmoldotConnection } from "capi"

/// Bring the chainspec into scope. Here, we'll import it from `fetch_chainspec.eg.ts`.
import { relayChainSpec } from "./fetch_chainspec.eg.ts"

/// Use the generate chain rune with `SmoldotConnection` and the chainspec.
const polkadot = PolkadotRune.from(SmoldotConnection.bind({ relayChainSpec }))

// Utilize the smoldot-connected `PolkadotRune` instance.
const { block } = await polkadot.blockHash().block().run(new Scope())

/// Ensure the block is of the expected shape.
console.log(block)
$.assert(known.$block, block)
