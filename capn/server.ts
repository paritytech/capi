import * as path from "../deps/std/path.ts"
import { PermanentMemo } from "../util/memo.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { Api, DevChain } from "./api.ts"
import { resolveBinary } from "./binary.ts"
import { CapiConfig } from "./CapiConfig.ts"
import { createCustomChainSpec, ParaChainSpec, startNetwork } from "./startNetwork.ts"
import { addTestUsers, testUserPublicKeys } from "./testUsers.ts"

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
        const spec = await createCustomChainSpec(
          path.resolve("target"),
          chainName,
          bin,
          chain.chain,
          async (chainSpec: ParaChainSpec) => {
            await addTestUsers(chainSpec.genesis.runtime.balances.balances)
          },
        )
        new Deno.Command(bin, {
          args: ["--tmp", "--alice", "--ws-port", `${port}`, "--chain", spec],
          stdin: "null",
          stdout: "piped",
          stderr: "piped",
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
      url: `ws://localhost:${port}/`,
      async nextUsers(count) {
        const index = userCount
        const newCount = index + count
        if (newCount < testUserPublicKeys.length) userCount = newCount
        else throw new Error("Maximum test user count reached")
        return index
      },
    }
  }
}
