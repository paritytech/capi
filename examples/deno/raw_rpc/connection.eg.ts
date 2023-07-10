/**
 * @title Raw Connection
 * @unstable
 * @description utilize a raw connection to interact with an RPC node
 */

import { $, WsConnection } from "capi"

/// The connection's life will be bound to the following controller.
const controller = new AbortController()
const { signal } = controller

/// Open the connection.
const connection = WsConnection.connect("wss://rpc.polkadot.io/", signal)

/// Use the connection to call the `system_version` RPC method.
const { result } = await connection.call("system_version", [])

/// Ensure the result is a string.
console.log(result)
$.assert($.str, result)

/// Dispose of the connection.
controller.abort()
