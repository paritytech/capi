import { Narrow } from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import { writableStreamFromWriter } from "../deps/std/streams.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { resolveBinary } from "./binary.ts"
import { NetworkConfig } from "./CapiConfig.ts"
import { createCustomChainSpec, getGenesisConfig } from "./chainSpec.ts"
import { addTestUsers } from "./testUsers.ts"

export interface Network {
  relay: NetworkChain
  paras: Record<string, NetworkChain>
}

export interface NetworkChain {
  testUserIndex: number
  bootnodes: string
  ports: number[]
}

export async function startNetwork(
  tempDir: string,
  config: NetworkConfig,
  signal: AbortSignal,
): Promise<Network> {
  const paras = await Promise.all(
    Object.entries(config.parachains ?? {}).map(async ([name, chain]) => {
      const binary = await resolveBinary(chain.binary, signal)

      const spec = await createCustomChainSpec(
        path.join(tempDir, name),
        binary,
        chain.chain,
        (chainSpec) => {
          chainSpec.para_id = chain.id
          const genesisConfig = getGenesisConfig(chainSpec)
          genesisConfig.parachainInfo.parachainId = chain.id
          addTestUsers(genesisConfig.balances.balances)
        },
      )

      const genesis = await exportParachainGenesis(binary, spec, signal)

      return {
        id: chain.id,
        name,
        binary,
        spec,
        genesis,
        count: chain.nodes ?? 2,
      }
    }),
  )

  const relayBinary = await resolveBinary(config.binary, signal)

  const relaySpec = await createCustomChainSpec(
    path.join(tempDir, "relay"),
    relayBinary,
    config.chain,
    (chainSpec) => {
      const genesisConfig = getGenesisConfig(chainSpec)
      if (paras.length) {
        genesisConfig.paras.paras.push(
          ...paras.map(({ id, genesis }) => [id, [...genesis, true]] satisfies Narrow),
        )
      }
      addTestUsers(genesisConfig.balances.balances)
    },
  )

  const relay = await spawnChain(
    path.join(tempDir, "relay"),
    relayBinary,
    relaySpec,
    config.nodes ?? 2,
    [],
    signal,
  )

  return {
    relay,
    paras: Object.fromEntries(
      await Promise.all(
        paras.map(async ({ name, binary, spec, count }) => {
          const chain = await spawnChain(
            path.join(tempDir, name),
            binary,
            spec,
            count,
            [
              "--",
              "--execution",
              "wasm",
              "--chain",
              relaySpec,
              "--bootnodes",
              relay.bootnodes,
            ],
            signal,
          )
          return [name, chain] satisfies Narrow
        }),
      ),
    ),
  }
}

async function exportParachainGenesis(
  binary: string,
  chain: string,
  signal: AbortSignal,
) {
  return await Promise.all(["state", "wasm"].map(async (type) => {
    const { success, stdout } = await new Deno.Command(binary, {
      args: [`export-genesis-${type}`, "--chain", chain],
      signal,
    }).output()
    if (!success) {
      // TODO: improve error message
      throw new Error(`export-genesis-${type} failed`)
    }
    return new TextDecoder().decode(stdout)
  })) satisfies string[] as [state: string, wasm: string]
}

function generateBootnodeString(port: number, peerId: string) {
  return `/ip4/127.0.0.1/tcp/${port}/p2p/${peerId}`
}

async function generateNodeKey(binary: string, signal?: AbortSignal) {
  const { success, stdout, stderr } = await new Deno.Command(binary, {
    args: ["key", "generate-node-key"],
    signal,
  }).output()
  if (!success) {
    throw new Error()
  }
  const decoder = new TextDecoder()
  const nodeKey = decoder.decode(stdout).trim()
  const peerId = decoder.decode(stderr).trim()
  return { nodeKey, peerId }
}

const keystoreAccounts = ["alice", "bob", "charlie", "dave", "eve", "ferdie", "one", "two"]
async function spawnChain(
  tempDir: string,
  binary: string,
  chain: string,
  count: number,
  extraArgs: string[],
  signal: AbortSignal,
): Promise<NetworkChain> {
  let bootnodes: string | undefined
  const ports = []

  for (let i = 0; i < count; i++) {
    const keystoreAccount = keystoreAccounts[i]
    if (!keystoreAccount) throw new Error("ran out of keystore accounts")
    const nodeDir = path.join(tempDir, keystoreAccount)
    await Deno.mkdir(nodeDir, { recursive: true })
    const httpPort = await getFreePort()
    const wsPort = await getFreePort()
    ports.push(wsPort)
    const args = [
      "--validator",
      `--${keystoreAccount}`,
      "--base-path",
      nodeDir,
      "--chain",
      chain,
      "--port",
      `${httpPort}`,
      "--ws-port",
      `${wsPort}`,
    ]
    if (bootnodes) {
      args.push("--bootnodes", bootnodes)
    } else {
      const { nodeKey, peerId } = await generateNodeKey(binary)
      args.push("--node-key", nodeKey)
      bootnodes = generateBootnodeString(httpPort, peerId)
    }
    args.push(...extraArgs)
    spawnNode(nodeDir, binary, args, signal)
    await portReady(wsPort)
  }

  if (!bootnodes) throw new Error("count must be > 1")
  return { testUserIndex: 0, bootnodes, ports }
}

async function spawnNode(tempDir: string, binary: string, args: string[], signal: AbortSignal) {
  console.log({ spawnNode: { binary, args } })
  const child = new Deno.Command(binary, {
    args,
    signal,
    stdout: "piped",
    stderr: "piped",
  }).spawn()

  child.stdout.pipeTo(
    writableStreamFromWriter(
      await Deno.open(path.join(tempDir, "stdout"), { write: true, create: true }),
    ),
  )

  child.stderr.pipeTo(
    writableStreamFromWriter(
      await Deno.open(path.join(tempDir, "stderr"), { write: true, create: true }),
    ),
  )

  child.status.then((status) => {
    if (!signal.aborted) {
      throw new Error(`process exited with code ${status.code} (${tempDir})`)
    }
  })
}
