/**
 * @title Dynamic Usage
 * @stability nearing
 *
 * You may want to write code whose target chain is unknown before runtime. A common
 * example of this is block explorers. These use cases are "dynamic" and require the use
 * of a subtly-different API. Compared to the chain-specific, codegened DX, the dynamic
 * DX has three key difference:
 *
 * 1. We manually initialize the `ChainRune`.
 * 2. We manually access bindings.
 * 3. Chain-specifics are untyped (which makes them error-prone).
 */

import { assertEquals } from "asserts"
import { ChainRune, SmoldotConnection, WsConnection } from "capi"

// Bring the chainspec(s) into scope. Here, we'll fetch it from the Smoldot GitHub repository.
const relayChainSpec = await (await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
)).text()

// Initialize a `ChainRune` with `SmoldotConnection` and the chainspec.
// deno-lint-ignore no-unused-vars
const smoldotChain = ChainRune.from(SmoldotConnection, { relayChainSpec })

// We could also initialize a `ChainRune` with `WsConnection` and an RPC node WebSocket URL.
const wsChain = ChainRune.from(WsConnection, "wss://rpc.polkadot.io")

// Create a binding to the `System` pallet.
const System = wsChain.pallet("System")

// Create a binding to the `Account` storage map.
const Account = System.storage("Account")

// Read the first ten entries of the `Account` storage map.
// Note how the lack of partial key is communicated via `null`.
const entries = await Account.entryPage(10, null).run()

// `entries` should contain 10 `AccountInfo`s
assertEquals(entries.length, 10)
