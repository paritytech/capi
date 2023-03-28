import { AddChainError } from "../deps/smoldot.ts"
import { deferred } from "../deps/std/async.ts"
import { assertEquals, assertRejects } from "../deps/std/testing/asserts.ts"
import { RpcSubscriptionMessage } from "./rpc_messages.ts"
import { SmoldotConnection } from "./smoldot.ts"

Deno.test({
  name: "Smoldot",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    await t.step("relay chain connection", async () => {
      const relayChainSpec = await fetchText(
        "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json",
      )
      const connection = new SmoldotConnection({ relayChainSpec })
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
    })

    await t.step("parachain connection", async () => {
      const relayChainSpec = await fetchText(
        "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/westend2.json",
      )
      const parachainSpec = await fetchText(
        "https://raw.githubusercontent.com/paritytech/substrate-connect/main/projects/demo/src/assets/westend-westmint.json",
      )
      const connection = new SmoldotConnection({
        relayChainSpec,
        parachainSpec,
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
    })

    await t.step(
      "invalid chain spec",
      async () => {
        await assertRejects(
          async () => {
            const connection = new SmoldotConnection({ relayChainSpec: "" })
            return connection["smoldotChainPending"]
          },
          AddChainError,
        )
      },
    )
  },
})
