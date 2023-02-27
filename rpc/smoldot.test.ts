import { deferred } from "../deps/std/async.ts"
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

    const pending = deferred()

    connection.subscription(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [false],
      (message) => {
        console.log({ message })
        pending.resolve()
      },
      controller.signal,
    )

    await pending
    controller.abort()

    // await delay(60 * 1000)
  },
})

async function fetchText(url: string) {
  return (await fetch(url)).text()
}
