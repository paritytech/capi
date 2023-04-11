/**
 * @title Smoldot Connection
 * @stability nearing
 * @description Smoldot enables users to run a tiny node in their browser,
 * such that they can connect directly to the network(s) without going through
 * a centralized intermediary. This is the future of unstoppable applications.
 */

import { $accountInfo, chain, createUsers } from "@capi/polkadot-dev"
import { $, SmoldotConnection } from "capi"

const { alexa } = await createUsers()

// Bring the chainspec(s) into scope. Here, we'll fetch it from the Smoldot GitHub repository.
const relayChainSpec = await (await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
)).text()

// Initialize a `ChainRune` with `SmoldotConnection` and the chainspec.
const smoldotChain = chain.with(SmoldotConnection.bind({ relayChainSpec }))

const accountInfo = await smoldotChain
  .pallet("System")
  .storage("Account")
  .value(alexa.publicKey)
  .run()

console.log("Account info:", accountInfo)
$.assert($accountInfo, accountInfo)
