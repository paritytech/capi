/**
 * @title Raw Connection
 * @unstable
 * @description utilize a raw connection to interact with an RPC node
 */

import { $, hex, WsConnection } from "capi"

/// The connection's life will be bound to the following controller.
const controller = new AbortController()
const { signal } = controller

/// Open the connection.
const connection = WsConnection.connect("wss://rpc.polkadot.io/", signal)

/// Use the connection to retrieve the raw FRAME metadata.
const { result } = await connection.call("state_getMetadata", [])

/// Ensure the result is a string.
$.assert($.str, result)

/// Dispose of the connection.
controller.abort()

/// Write the metadata to a a file for later use.
await Deno.writeFile(
  new URL("./metadata", import.meta.url),
  hex.decode(result),
)
