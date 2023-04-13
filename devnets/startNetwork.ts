import { Narrow } from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import { writableStreamFromWriter } from "../deps/std/streams.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { resolveBinary } from "./binary.ts"
import { NetworkConfig } from "./CapiConfig.ts"
import {
  createCustomChainSpec,
  createRawChainSpec,
  GenesisConfig,
  getGenesisConfig,
} from "./chainSpec.ts"
import { addDevUsers } from "./devUsers.ts"

export interface Network {
  relay: NetworkChain
  paras: Record<string, NetworkChain>
}

export interface NetworkChain {
  bootnodes: string
  ports: number[]
}

export async function startNetworkForMetadata(
  tempDir: string,
  config: NetworkConfig,
  signal: AbortSignal,
): Promise<Network> {
  const relayBinary = await resolveBinary(config.binary, signal)
  const relaySpec = await createRawChainSpec(path.join(tempDir, "relay"), relayBinary, config.chain)
  const [relay, paras] = await Promise.all([
    spawnChain(
      path.join(tempDir, "relay"),
      relayBinary,
      relaySpec,
      1,
      [],
      relayBinary,
      signal,
    ),
    Promise.all(
      Object.entries(config.parachains ?? {}).map(async ([name, config]) => {
        const binary = await resolveBinary(config.binary, signal)
        const chain = await spawnChain(
          path.join(tempDir, name),
          binary,
          await createRawChainSpec(path.join(tempDir, name), binary, config.chain),
          1,
          [
            "--",
            "--execution",
            "wasm",
            "--chain",
            relaySpec,
          ],
          relayBinary,
          signal,
        )
        return [name, chain] satisfies Narrow
      }),
    ),
  ])
  return {
    relay,
    paras: Object.fromEntries(paras),
  }
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
          addDevUsers(genesisConfig.balances.balances)
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
  const minValidators = Math.max(2, paras.length)
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
        addXcmHrmpChannels(genesisConfig, paras.map(({ id }) => id))
      }
      addAuthorities(genesisConfig, minValidators)
      addDevUsers(genesisConfig.balances.balances)
    },
  )
  const relay = await spawnChain(
    path.join(tempDir, "relay"),
    relayBinary,
    relaySpec,
    config.nodes ?? minValidators,
    [],
    relayBinary,
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
            relayBinary,
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

const keystoreAccounts = ["alice", "bob", "charlie", "dave", "eve", "ferdie"]
async function spawnChain(
  tempDir: string,
  binary: string,
  chain: string,
  count: number,
  extraArgs: string[],
  generateNodeKeyBinary: string,
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
      const { nodeKey, peerId } = await generateNodeKey(generateNodeKeyBinary)
      args.push("--node-key", nodeKey)
      bootnodes = generateBootnodeString(httpPort, peerId)
    }
    args.push(...extraArgs)
    spawnNode(nodeDir, binary, args, signal)
    await portReady(wsPort)
  }

  if (!bootnodes) throw new Error("count must be > 1")
  return { bootnodes, ports }
}

async function spawnNode(tempDir: string, binary: string, args: string[], signal: AbortSignal) {
  console.log("BEFORE DOWNLOAD", binary, args)
  const child = new Deno.Command(binary, {
    args,
    signal,
    stdout: "piped",
    stderr: "piped",
  }).spawn()
  console.log("AFTER DOWNLOAD", binary, args)

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

const authorities = [
  {
    name: "alice",
    srAccount: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    srStash: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    edAccount: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
    // cspell:disable-next-line
    ecAccount: "KW39r9CJjAVzmkf9zQ4YDb2hqfAVGdRqn53eRqyruqpxAP5YL",
  },
  {
    name: "bob",
    srAccount: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    srStash: "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    edAccount: "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
    // cspell:disable-next-line
    ecAccount: "KWByAN7WfZABWS5AoWqxriRmF5f2jnDqy3rB5pfHLGkY93ibN",
  },
  {
    name: "charlie",
    srAccount: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    srStash: "5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT",
    edAccount: "5DbKjhNLpqX3zqZdNBc9BGb4fHU1cRBaDhJUskrvkwfraDi6",
    // cspell:disable-next-line
    ecAccount: "KWBpGtyJLBkJERdZT1a1uu19c2uPpZm9nFd8SGtCfRUAT3Y4w",
  },
  {
    name: "dave",
    srAccount: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    srStash: "5HKPmK9GYtE1PSLsS1qiYU9xQ9Si1NcEhdeCq9sw5bqu4ns8",
    edAccount: "5ECTwv6cZ5nJQPk6tWfaTrEk8YH2L7X1VT4EL5Tx2ikfFwb7",
    // cspell:disable-next-line
    ecAccount: "KWCycezxoy7MWTTqA5JDKxJbqVMiNfqThKFhb5dTfsbNaGbrW",
  },
  {
    name: "eve",
    srAccount: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
    srStash: "5FCfAonRZgTFrTd9HREEyeJjDpT397KMzizE6T3DvebLFE7n",
    edAccount: "5Ck2miBfCe1JQ4cY3NDsXyBaD6EcsgiVmEFTWwqNSs25XDEq",
    // cspell:disable-next-line
    ecAccount: "KW9NRAHXUXhBnu3j1AGzUXs2AuiEPCSjYe8oGan44nwvH5qKp",
  },
  {
    name: "ferdie",
    srAccount: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
    srStash: "5CRmqmsiNFExV6VbdmPJViVxrWmkaXXvBrSX8oqBT8R9vmWk",
    edAccount: "5E2BmpVFzYGd386XRCZ76cDePMB3sfbZp5ZKGUsrG1m6gomN",
    // cspell:disable-next-line
    ecAccount: "KW6E1KGr5pqJ9Trgt7eAuA7d7mgpJPydiEDKc2h1aGTEEzYC1",
  },
] as const
function addAuthorities(genesisConfig: GenesisConfig, count: number) {
  if (count > authorities.length) {
    throw new Error(`authorities count should be <= ${authorities.length}`)
  }
  // TODO: #889 add support for pallet_session, pallet_aura and pallet_grandpa
  if (!genesisConfig.session) return
  genesisConfig.session.keys.length = 0
  authorities.slice(0, count).forEach(({ srAccount, srStash, edAccount, ecAccount }) =>
    genesisConfig.session!.keys.push([
      srStash,
      srStash,
      {
        grandpa: edAccount,
        babe: srAccount,
        im_online: srAccount,
        para_validator: srAccount,
        para_assignment: srAccount,
        authority_discovery: srAccount,
        beefy: ecAccount,
      },
    ])
  )
}

const hrmpChannelMaxCapacity = 8
const hrmpChannelMaxMessageSize = 512
function addXcmHrmpChannels(
  genesisConfig: GenesisConfig,
  paraIds: number[],
) {
  genesisConfig.hrmp ??= { preopenHrmpChannels: [] }
  for (const senderParaId of paraIds) {
    for (const recipientParaId of paraIds) {
      if (senderParaId === recipientParaId) continue
      genesisConfig.hrmp.preopenHrmpChannels.push([
        senderParaId,
        recipientParaId,
        hrmpChannelMaxCapacity,
        hrmpChannelMaxMessageSize,
      ])
    }
  }
}
