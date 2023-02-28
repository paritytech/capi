import { deferred } from "../deps/std/async.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { RpcSubscriptionMessage } from "./rpc_messages.ts"
import { SmoldotConnection } from "./smoldot.ts"

Deno.test({
  name: "Smoldot",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const relayChainSpec = await fetchText(
      "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json",
    )
    const connection = new SmoldotConnection({
      relayChainSpec,
    })
    await connection.ready()
    const controller = new AbortController()
    const pendingMessage = deferred<RpcSubscriptionMessage>()
    connection.subscription(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [false],
      (message) => {
        controller.abort()
        pendingMessage.resolve(message)
      },
      controller.signal,
    )
    const message = await pendingMessage
    assertEquals((await message.params?.result as any).event, "initialized")
  },
})

async function fetchText(url: string) {
  return (await fetch(url)).text()
}
