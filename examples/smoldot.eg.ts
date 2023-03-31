/**
 * @title Smoldot Connection
 * @stability nearing
 *
 * Smoldot enables users to run a tiny node in their browser, such that they can connect
 * directly to the network(s) without going through a centralized intermediary. This is
 * the future of unstoppable applications.
 */

import { $, $extrinsic, ChainRune, Rune, SmoldotConnection } from "capi"

// Bring the chainspec(s) into scope. Here, we'll fetch it from the Smoldot GitHub repository.
const relayChainSpec = await (await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
)).text()

// Initialize a `ChainRune` with `SmoldotConnection` and the chainspec.
const smoldotChain = ChainRune.from(SmoldotConnection, { relayChainSpec })

const [metadata, extrinsics] = await Rune
  .tuple([
    smoldotChain.metadata,
    smoldotChain.blockHash().block().extrinsics(),
  ])
  .run()

$.assert($.array($extrinsic(metadata)), extrinsics)
