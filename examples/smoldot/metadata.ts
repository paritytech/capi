import { hex, WsConnection } from "capi"

// A tiny utility used in our `capi.config.ts`. This utility demonstrates how one
// might go about retrieving a chain's raw scale-encoded metadata bytes.
export async function metadata() {
  const controller = new AbortController()
  const { signal } = controller
  const connection = WsConnection.connect("wss://rpc.polkadot.io/", signal)
  const result = await connection.call("state_getMetadata", [])
  const metadata = result.result as string
  controller.abort()
  return hex.decode(metadata)
}
