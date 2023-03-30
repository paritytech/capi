import { download } from "../deps/capi_binary_builds.ts"
import * as path from "../deps/std/path.ts"
import { getAvailable } from "../util/port.ts"

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
    prefix: "capi-network",
  })
  console.log({ tempDir })

  const parachainCmd = await download("polkadot-parachain", "v0.9.370")
  const parachainChainSpec = await generatePlainChainSpec<ParaChainSpec>(
    parachainCmd,
    "statemine-local",
    signal,
  )
  // FIXME: add custom account balances
  parachainChainSpec.para_id = parachainId
  parachainChainSpec.genesis.runtime.parachainInfo.parachainId = parachainId

  const parachainChainSpecPath = path.join(tempDir, "parachain-chainspec.json")
  await Deno.writeTextFile(parachainChainSpecPath, JSON.stringify(parachainChainSpec, undefined, 2))

  const parachainRawChainSpec = await generateRawChainSpec(
    parachainCmd,
    parachainChainSpecPath,
    signal,
  )
  const parachainRawChainSpecPath = path.join(tempDir, "parachain-raw-chainspec.json")
  await Deno.writeTextFile(
    parachainRawChainSpecPath,
    JSON.stringify(parachainRawChainSpec, undefined, 2),
  )

  const parachainWasm = await parachainExportGenesis(
    parachainCmd,
    parachainRawChainSpecPath,
    "wasm",
    signal,
  )
  const parachainState = await parachainExportGenesis(
    parachainCmd,
    parachainRawChainSpecPath,
    "state",
    signal,
  )

  const relayCmd = await download("polkadot", "v0.9.37")
  const nodeKey = await generateNodeKey(relayCmd, signal)

  const chainSpec = await generatePlainChainSpec(relayCmd, "rococo-local", signal)
  // FIXME: add custom account balances
  chainSpec.genesis.runtime.runtime_genesis_config.paras.paras.push(
    [parachainId, [parachainState, parachainWasm, true]],
  )

  const relayChainSpecPath = path.join(tempDir, "relay-chainspec.json")
  await Deno.writeTextFile(relayChainSpecPath, JSON.stringify(chainSpec, undefined, 2))

  const rawChainSpec = await generateRawChainSpec(relayCmd, relayChainSpecPath, signal)
  const relayRawChainSpecPath = path.join(tempDir, "relay-raw-chainspec.json")
  await Deno.writeTextFile(relayRawChainSpecPath, JSON.stringify(rawChainSpec, undefined, 2))

  const relayBootNodePath = path.join(tempDir, "relay-bootnode")
  const relayBootNode = spawnRelayBootNode({
    command: relayCmd,
    chain: relayRawChainSpecPath,
    keystoreAccount: "alice",
    basePath: relayBootNodePath,
    nodeKey: nodeKey.nodeKey,
    signal,
  })
  console.log({ relayBootNode })

  const relayNodePath = path.join(tempDir, "relay-node")
  const relayBootNodes = generateBootnodeString(relayBootNode.port, nodeKey.peerId)
  const relayNode = spawnRelayNode({
    command: relayCmd,
    chain: relayRawChainSpecPath,
    keystoreAccount: "bob",
    basePath: relayNodePath,
    bootnodes: relayBootNodes,
    signal,
  })
  console.log({ relayNode })

  const parachainNodeKey = await generateNodeKey(parachainCmd, signal)
  const parachainBootNodePath = path.join(tempDir, "parachain-bootnode")
  const parachainBootNode = spawnParachainBootNode({
    command: parachainCmd,
    chain: parachainRawChainSpecPath,
    keystoreAccount: "alice",
    basePath: parachainBootNodePath,
    nodeKey: parachainNodeKey.nodeKey,
    relayChain: relayRawChainSpecPath,
    relayBootnodes: relayBootNodes,
    signal,
  })
  console.log({ parachainBootNode })

  const parachainBootNodes = generateBootnodeString(parachainBootNode.port, parachainNodeKey.peerId)
  const parachainNodePath = path.join(tempDir, "parachain-node")
  const parachainNode = spawnParachainNode({
    command: parachainCmd,
    chain: parachainRawChainSpecPath,
    keystoreAccount: "bob",
    basePath: parachainNodePath,
    bootnodes: parachainBootNodes,
    relayChain: relayRawChainSpecPath,
    relayBootnodes: relayBootNodes,
    signal,
  })
  console.log({ parachainNode })

  // signal.addEventListener("abort", () => {
  //   relayBootNode.child.kill("SIGKILL")
  //   relayNode.child.kill("SIGKILL")
  //   parachainBootNode.child.kill("SIGKILL")
  //   parachainNode.child.kill("SIGKILL")
  // })
}

async function parachainExportGenesis(
  binary: string,
  chain: string,
  type: "wasm" | "state",
  signal: AbortSignal,
) {
  const { success, stdout } = await new Deno.Command(binary, {
    args: [`export-genesis-${type}`, "--chain", chain],
    signal,
  }).output()
  if (!success) {
    throw new Error()
  }
  return new TextDecoder().decode(stdout)
}

interface SpawnParachainNodeProps {
  command: string
  chain: string
  keystoreAccount: string
  basePath: string
  bootnodes: string
  relayChain: string
  relayBootnodes: string
  signal: AbortSignal
}

function spawnParachainNode({
  command,
  chain,
  keystoreAccount,
  basePath,
  bootnodes,
  relayChain,
  relayBootnodes,
  signal,
}: SpawnParachainNodeProps) {
  const [port, wsPort] = [getAvailable(), getAvailable()]
  const child = new Deno.Command(command, {
    args: [
      "--collator",
      `--${keystoreAccount}`,
      "--force-authoring",
      "--base-path",
      basePath,
      "--chain",
      chain,
      "--port",
      `${port}`,
      "--ws-port",
      `${wsPort}`,
      "--bootnodes",
      bootnodes,
      "--",
      "--execution",
      "wasm",
      "--chain",
      relayChain,
      "--bootnodes",
      relayBootnodes,
    ],
    stdout: "piped",
    stderr: "piped",
    signal,
  }).spawn()

  // TODO: redirect stdout/stderr to a file

  // TODO: handle child early exit
  // child.status.then(({ success }) => {
  //   if (!success) {
  //   }
  // })

  return { child, port, wsPort }
}

interface SpawnParachainBootNodeProps {
  command: string
  chain: string
  keystoreAccount: string
  basePath: string
  nodeKey: string
  relayChain: string
  relayBootnodes: string
  signal: AbortSignal
}

function spawnParachainBootNode({
  command,
  chain,
  keystoreAccount,
  basePath,
  nodeKey,
  relayChain,
  relayBootnodes,
  signal,
}: SpawnParachainBootNodeProps) {
  const [port, wsPort] = [getAvailable(), getAvailable()]
  const child = new Deno.Command(command, {
    args: [
      "--collator",
      `--${keystoreAccount}`,
      "--force-authoring",
      "--base-path",
      basePath,
      "--chain",
      chain,
      "--port",
      `${port}`,
      "--ws-port",
      `${wsPort}`,
      "--node-key",
      nodeKey,
      "--",
      "--execution",
      "wasm",
      "--chain",
      relayChain,
      "--bootnodes",
      relayBootnodes,
    ],
    stdout: "piped",
    stderr: "piped",
    signal,
  }).spawn()

  // TODO: redirect stdout/stderr to a file

  // TODO: handle child early exit
  // child.status.then(({ success }) => {
  //   if (!success) {
  //   }
  // })

  return { child, port, wsPort }
}

function generateBootnodeString(port: number, peerId: string) {
  return `/ip4/127.0.0.1/tcp/${port}/p2p/${peerId}`
}

interface SpawnRelayNodeProps {
  command: string
  chain: string
  keystoreAccount: string
  basePath: string
  bootnodes: string
  signal: AbortSignal
}

function spawnRelayNode({
  command,
  chain,
  keystoreAccount,
  basePath,
  bootnodes,
  signal,
}: SpawnRelayNodeProps) {
  const [port, wsPort] = [getAvailable(), getAvailable()]
  const child = new Deno.Command(command, {
    args: [
      "--validator",
      `--${keystoreAccount}`,
      "--base-path",
      basePath,
      "--chain",
      chain,
      "--port",
      `${port}`,
      "--ws-port",
      `${wsPort}`,
      "--bootnodes",
      bootnodes,
    ],
    stdout: "piped",
    stderr: "piped",
    signal,
  }).spawn()

  // TODO: redirect stdout/stderr to a file

  // TODO: handle child early exit
  // child.status.then(({ success }) => {
  //   if (!success) {
  //   }
  // })

  return { child, port, wsPort }
}

interface SpawnRelayBootNodeProps {
  command: string
  chain: string
  keystoreAccount: string
  basePath: string
  nodeKey: string
  signal: AbortSignal
}

function spawnRelayBootNode({
  command,
  chain,
  keystoreAccount,
  basePath,
  nodeKey,
  signal,
}: SpawnRelayBootNodeProps) {
  const [port, wsPort] = [getAvailable(), getAvailable()]
  const child = new Deno.Command(command, {
    args: [
      "--validator",
      `--${keystoreAccount}`,
      "--base-path",
      basePath,
      "--chain",
      chain,
      "--port",
      `${port}`,
      "--ws-port",
      `${wsPort}`,
      "--node-key",
      nodeKey,
    ],
    stdout: "piped",
    stderr: "piped",
    signal,
  }).spawn()

  // TODO: redirect stdout/stderr to a file

  // TODO: handle child early exit
  // child.status.then(({ success }) => {
  //   if (!success) {
  //   }
  // })

  return { child, port, wsPort }
}

async function generateRawChainSpec(binary: string, chain: string, signal: AbortSignal) {
  const { success, stdout } = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain, "--raw"],
    signal,
  }).output()
  if (!success) {
    throw new Error()
  }
  return JSON.parse(new TextDecoder().decode(stdout))
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

async function generatePlainChainSpec<T extends ChainSpec | ParaChainSpec = ChainSpec>(
  binary: string,
  chain?: string,
  signal?: AbortSignal,
) {
  const args = ["build-spec", "--disable-default-bootnode"]
  if (chain) {
    args.push("--chain", chain)
  }
  const { success, stdout } = await new Deno.Command(binary, { args, signal }).output()
  if (!success) {
    throw new Error()
  }
  return JSON.parse(new TextDecoder().decode(stdout)) as T
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
