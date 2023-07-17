import { metadata } from "@capi/polkadot"
import { hex } from "capi"
import { Client, ClientOptions, start } from "../../deps/smoldot.ts"

import { delay } from "../../deps/std/async.ts"
import { relayChainSpec } from "./fetch_chainspec.eg.ts"

const client: Client = start({
  forbidTcp: true,
  forbidNonLocalWs: true,
  cpuRateLimit: .25,
} as ClientOptions)

const relayChain = await client.addChain({
  chainSpec: relayChainSpec,
  // disableJsonRpc: true,
})

init()
async function init() {
  while (true) {
    const message = JSON.parse(await relayChain.nextJsonRpcResponse())
    console.log("<<<", message)
    onMessage(message)
  }
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
  relayChain.sendJsonRpc(JSON.stringify(message))
}

let followSubscription: string | undefined
async function onMessage(message: Record<string, any>) {
  if (
    message.method === "chainHead_unstable_followEvent"
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
    message.method === "chainHead_unstable_storageEvent"
    && message.params.result.event === "done"
  ) {
    console.log(
      "timestamp",
      metadata.pallets.Timestamp.storage.Now.value.decode(hex.decode(message.params.result.value)),
    )
  }
}
