import { WsConnection } from "../rpc/mod.ts"

const controller = new AbortController()
const client = WsConnection.connect("ws://localhost:4646/frame/dev/polkadot/@x", controller.signal)

await client.call("state_getMetadata", [])

await client.call("state_getMetadata", [])

controller.abort()

console.log("hmm")

self.addEventListener("unload", () => console.log("exiting inner"))
