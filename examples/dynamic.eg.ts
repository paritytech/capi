/**
 * @title Dynamic Usage
 * @stability nearing
 * @description You may want to write code whose target chain is unknown before
 * runtime. A common example of this is block explorers. Use cases such as this
 * are "dynamic" in that they require one to read the chain's metadata at runtime
 * in order to derive the means of interacting with that chain. Dynamic usage of
 * Capi entails a subtly-different DX compared to that of chain-specific (codegen)
 * usage. There are three key differences:
 *
 * 1. We manually initialize the `ChainRune`.
 * 2. We manually access bindings.
 * 3. Chain-specifics are untyped (be wary to supply the correct data, as the checker is on vacation).
 */

import { $, ChainRune, WsConnection } from "capi"

// We could also initialize a `ChainRune` with `WsConnection` and an RPC node WebSocket URL.
const wsChain = ChainRune.from(WsConnection.bind("wss://rpc.polkadot.io"))

const metadata = await wsChain.metadata.run()

console.log(metadata.types)
