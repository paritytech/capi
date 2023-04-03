import { PermanentMemo } from "../util/memo.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { Api, DevChain } from "./api.ts"
import { resolveBinary } from "./binary.ts"
import { DEFAULT_TEST_USER_COUNT } from "./chainSpec.ts"
import { CapiConfig } from "./mod.ts"
import { startNetwork } from "./startNetwork.ts"

export function createApi(config: CapiConfig, signal: AbortSignal): Api {
  const chainMemo = new PermanentMemo<string, DevChain>()
  const networkMemo = new PermanentMemo<string, Map<string, DevChain>>()
  return {
    getChain(chainName) {
      const chain = config.chains?.[chainName]
      if (!chain) throw new Error("chain does not exist")
      if (chain.url !== undefined) throw new Error("chain is a proxy chain")
      return chainMemo.run(chainName, async () => {
        const bin = await resolveBinary(chain.binary, signal)
        const port = getFreePort()
        new Deno.Command(bin, {
          args: ["--chain", chain.chain, "--ws-port", `${port}`],
          stdin: "null",
          stdout: "inherit",
          stderr: "inherit",
          signal,
        }).spawn()
        await portReady(port)
        return createDevChain(port)
      })
    },
    getNetwork(networkName) {
      const network = config.networks?.[networkName]
      if (!network) throw new Error("network does not exist")
      return networkMemo.run(networkName, async () => {
        const ports = await startNetwork(network, signal)
        return new Map(
          Object.entries(ports).map(([name, ports]) => [name, createDevChain(ports[0]!)]),
        )
      })
    },
  }

  function createDevChain(port: number): DevChain {
    let userCount = 0
    return {
      url: `ws://localhost:${port}`,
      async nextUsers(count) {
        const index = userCount
        const newCount = index + count
        if (newCount < DEFAULT_TEST_USER_COUNT) userCount = newCount
        else throw new Error("Maximum test user count reached")
        return index
      },
    }
  }
}
