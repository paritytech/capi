import { metadata } from "@capi/polkadot"
import { hex } from "capi"

import { delay } from "../../deps/std/async.ts"

const ws = new WebSocket("wss://rpc.polkadot.io")

await new Promise((resolve) => ws.addEventListener("open", resolve))

init()
async function init() {
  ws.addEventListener("message", (e) => {
    const message = JSON.parse(e.data)
    console.log("<<<", message)
    onMessage(message)
  })
}

let count = 0
send("chainHead_unstable_follow", [false])
function send(method: string, params: unknown[]) {
  const message = {
    jsonrpc: "2.0",
    id: count++,
    method,
    params,
  }
  console.log(">>>", message)
  ws.send(JSON.stringify(message))
}

let followSubscription: string | undefined
async function onMessage(message: Record<string, any>) {
  if (
    ["chainHead_unstable_followEvent", "chainHead_unstable_follow"].includes(message.method)
    && message.params.result.event === "initialized"
  ) {
    followSubscription = message.params.subscription
    const finalizedBlockHash = message.params.result.finalizedBlockHash

    for (const _attempt of new Array(15)) {
      // send("chainHead_unstable_header", [followSubscription, finalizedBlockHash])
      await delay(1000)
      send("chainHead_unstable_storage", [
        followSubscription,
        finalizedBlockHash,
        hex.encodePrefixed(metadata.pallets.Timestamp.storage.Now.key.encode()),
        // null,
        // "value",
        // null,
      ])
    }
  } else if (
    ["chainHead_unstable_storageEvent", "chainHead_unstable_storage"].includes(message.method)
    && message.params.result.event === "done"
  ) {
    console.log(
      "timestamp",
      metadata.pallets.Timestamp.storage.Now.value.decode(hex.decode(message.params.result.result)),
    )
  }
}
