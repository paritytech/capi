import { download } from "../deps/capi_binary_builds.ts"
import * as path from "../deps/std/path.ts"
import { writableStreamFromWriter } from "../deps/std/streams.ts"
import { getFreePort } from "../util/port.ts"

if (import.meta.main) {
  const controller = new AbortController()
  Deno.addSignalListener("SIGINT", () => controller.abort())
  Deno.addSignalListener("SIGTERM", () => controller.abort())

  startNetwork(controller.signal)
}

async function startNetwork(signal: AbortSignal) {
  const parachainId = 2000
  const tempDir = await Deno.makeTempDir({
    dir: path.join(Deno.cwd(), "tmp"),
    prefix: `capn-${new Date().toISOString()}-`,
  })
  console.log({ tempDir })

  const parachainCmd = await download("polkadot-parachain", "v0.9.370")

  const parachainRawChainSpecPath = await createCustomChainSpec(
    tempDir,
    "parachain",
    parachainCmd,
    "statemine-local",
    (chainSpec: ParaChainSpec) => {
      // TODO: add custom account balances
      chainSpec.para_id = parachainId
      chainSpec.genesis.runtime.parachainInfo.parachainId = parachainId
      return chainSpec
    },
  )

  const parachainGenesis = await exportParachainGenesis(
    parachainCmd,
    parachainRawChainSpecPath,
    signal,
  )

  const relayCmd = await download("polkadot", "v0.9.37")

  const relayRawChainSpecPath = await createCustomChainSpec(
    tempDir,
    "relay",
    relayCmd,
    "rococo-local",
    (chainSpec: ChainSpec) => {
      // TODO: add custom account balances
      chainSpec.genesis.runtime.runtime_genesis_config.paras.paras.push(
        [parachainId, [...parachainGenesis, true]],
      )
      return chainSpec
    },
  )

  const relayBootnodes = await spawnNodes(
    path.join(tempDir, "relay"),
    relayCmd,
    relayRawChainSpecPath,
    8,
    [],
    signal,
  )

  await spawnNodes(
    path.join(tempDir, "parachain"),
    parachainCmd,
    parachainRawChainSpecPath,
    8,
    [
      "--",
      "--execution",
      "wasm",
      "--chain",
      relayRawChainSpecPath,
      "--bootnodes",
      relayBootnodes,
    ],
    signal,
  )
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

interface ChainSpec {
  bootNodes: string[]
  genesis: {
    runtime: {
      runtime_genesis_config: {
        paras: {
          paras: [
            [
              parachainId: number,
              genesis: [state: string, wasm: string, kind: boolean],
            ],
          ]
        }
        balances: {
          balances: [account: string, initialBalance: number][]
        }
      }
    }
  }
}

interface ParaChainSpec {
  bootNodes: string[]
  para_id: number
  genesis: {
    runtime: {
      parachainInfo: {
        parachainId: number
      }
      balances: {
        balances: [account: string, initialBalance: number][]
      }
    }
  }
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
  const nodeKey = decoder.decode(stdout)
  const peerId = decoder.decode(stderr).replace("\n", "")
  return { nodeKey, peerId }
}

async function createCustomChainSpec<T>(
  tempDir: string,
  id: string,
  binary: string,
  chain: string,
  customize: (chainSpec: T) => T,
) {
  const specResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain],
  }).output()
  if (!specResult.success) {
    // TODO: improve error message
    throw new Error("build-spec failed")
  }
  const spec = customize(JSON.parse(new TextDecoder().decode(specResult.stdout)))

  const specPath = path.join(tempDir, `${id}-chainspec.json`)
  await Deno.writeTextFile(specPath, JSON.stringify(spec, undefined, 2))

  const rawResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", specPath, "--raw"],
  }).output()
  if (!rawResult.success) {
    // TODO: improve error message
    throw new Error("build-spec --raw failed")
  }

  const rawPath = path.join(tempDir, `${id}-chainspec-raw.json`)
  await Deno.writeFile(rawPath, rawResult.stdout)

  return rawPath
}

const keystoreAccounts = ["alice", "bob", "charlie", "dave", "eve", "ferdie", "one", "two"]
async function spawnNodes(
  dir: string,
  binary: string,
  chain: string,
  count: number,
  extraArgs: string[],
  signal: AbortSignal,
) {
  let bootnodes: string | undefined

  for (let i = 0; i < count; i++) {
    const keystoreAccount = keystoreAccounts[i]
    if (!keystoreAccount) throw new Error("ran out of keystore accounts")
    const nodeDir = path.join(dir, keystoreAccount)
    await Deno.mkdir(nodeDir, { recursive: true })
    const port = getFreePort()
    const wsPort = getFreePort()
    const args = [
      "--validator",
      `--${keystoreAccount}`,
      "--base-path",
      nodeDir,
      "--chain",
      chain,
      "--port",
      `${port}`,
      "--ws-port",
      `${wsPort}`,
    ]
    if (bootnodes) {
      args.push("--bootnodes", bootnodes)
    } else {
      const { nodeKey, peerId } = await generateNodeKey(binary)
      args.push("--node-key", nodeKey)
      bootnodes = generateBootnodeString(port, peerId)
    }
    args.push(...extraArgs)
    spawnNode(nodeDir, binary, args, signal)
    console.log(binary, keystoreAccount, wsPort)
  }

  if (!bootnodes) throw new Error("count must be > 1")
  return bootnodes
}

async function spawnNode(dir: string, binary: string, args: string[], signal: AbortSignal) {
  const child = new Deno.Command(binary, {
    args,
    signal,
    stdout: "piped",
    stderr: "piped",
  }).spawn()

  child.stdout.pipeTo(
    writableStreamFromWriter(
      await Deno.open(path.join(dir, "stdout"), { write: true, create: true }),
    ),
  )

  child.stderr.pipeTo(
    writableStreamFromWriter(
      await Deno.open(path.join(dir, "stderr"), { write: true, create: true }),
    ),
  )

  child.status.then((status) => {
    if (!signal.aborted) {
      throw new Error(`process exited with code ${status.code}`)
    }
  })
}
