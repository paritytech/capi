/**
 * @title Dynamic Usage
 * @stability nearing
 *
 * You may want to write code whose target chain is unknown before runtime. A common
 * example of this is block explorers. Use cases such as this are "dynamic" in that they require
 * one to read the chain's metadata at runtime in order to derive the means of interacting with
 * that chain. Dynamic usage of Capi entails a subtly-different DX compared to that of chain-specific
 * (codegen) usage. There are three key difference:
 *
 * 1. We manually initialize the `ChainRune`.
 * 2. We manually access bindings.
 * 3. Chain-specifics are untyped (be wary to supply the correct data, as the checker is on vacation).
 */

import { $, ChainRune, SmoldotConnection, WsConnection } from "capi"

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

// The result should contain a `[Uint8Array, AccountInfo]` tuple of length 10.
$.assert(
  $.sizedArray(
    $.tuple(
      $.sizedUint8Array(32),
      $.object(
        $.field("nonce", $.u32),
        $.field("consumers", $.u32),
        $.field("providers", $.u32),
        $.field("sufficients", $.u32),
        $.field(
          "data",
          $.object(
            $.field("free", $.u128),
            $.field("reserved", $.u128),
            $.field("miscFrozen", $.u128),
            $.field("feeFrozen", $.u128),
          ),
        ),
      ),
    ),
    10,
  ),
  entries,
)