import { hex } from "../crypto/mod.ts"
import * as ed25519 from "../deps/ed25519.ts"
import * as base58 from "../deps/std/encoding/base58.ts"
import * as path from "../deps/std/path.ts"
import { writableStreamFromWriter } from "../deps/std/streams.ts"
import { PermanentMemo } from "../util/memo.ts"
import { getFreePort, portReady } from "../util/port.ts"
import { BinaryResolver } from "./bins.ts"
import { createRawChainSpec } from "./chain_spec/mod.ts"
import type { DevRelaySpec } from "./DevRelaySpec.ts"
import { getMetadataFromWsUrl, NetSpec } from "./NetSpec.ts"

export interface DevNetProps {
  bin: BinaryResolver
  chain: string
  nodeCount?: number
  genesis?: Record<string, unknown>
}

export abstract class DevNetSpec extends NetSpec {
  readonly binary
  readonly chain
  readonly nodeCount
  readonly genesis
  constructor(props: DevNetProps) {
    super()
    this.binary = props.bin
    this.chain = props.chain
    this.nodeCount = props.nodeCount
    this.genesis = props.genesis
  }

  abstract relay: DevRelaySpec
  abstract preflightNetworkArgs(signal: AbortSignal, devnetTempDir: string): Promise<string[]>

  connection(name: string) {
    return {
      type: "DevnetConnection" as const,
      discovery: name,
    }
  }

  tempDir(parentDir: string) {
    return path.join(parentDir, this.name)
  }

  readonly #rawChainSpecPaths = new PermanentMemo<string, string>()
  async rawChainSpecPath(signal: AbortSignal, devnetTempDir: string) {
    const tempDir = this.tempDir(devnetTempDir)
    return this.#rawChainSpecPaths.run(
      tempDir,
      async () => createRawChainSpec(tempDir, await this.binary(signal), this.chain),
    )
  }

  async preflightNetwork(signal: AbortSignal, devnetTempDir: string) {
    const [chainSpecPath, extraArgs] = await Promise.all([
      this.rawChainSpecPath(signal, devnetTempDir),
      this.preflightNetworkArgs(signal, devnetTempDir),
    ])
    return spawnDevNet({
      tempDir: this.tempDir(devnetTempDir),
      binary: await this.binary(signal),
      chainSpecPath,
      nodeCount: 1,
      extraArgs,
      signal,
    })
  }

  async metadata(signal: AbortSignal, devnetTempDir: string) {
    const { ports: [port0] } = await this.preflightNetwork(signal, devnetTempDir)
    return getMetadataFromWsUrl(`ws://127.0.0.1:${port0}`)
  }
}

export interface SpawnDevNetProps {
  tempDir: string
  binary: string
  chainSpecPath: string
  nodeCount: number
  extraArgs: string[]
  signal: AbortSignal
}

export interface DevNet {
  bootnodes: string
  ports: number[]
}

const keystoreAccounts = ["alice", "bob", "charlie", "dave", "eve", "ferdie"]

export async function spawnDevNet({
  tempDir,
  binary,
  chainSpecPath,
  nodeCount,
  extraArgs,
  signal,
}: SpawnDevNetProps): Promise<DevNet> {
  let bootnodes: string | undefined
  const ports = []
  for (let i = 0; i < nodeCount; i++) {
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
      chainSpecPath,
      "--port",
      `${httpPort}`,
      "--ws-port",
      `${wsPort}`,
    ]
    if (bootnodes) {
      args.push("--bootnodes", bootnodes)
    } else {
      const nodeKey = crypto.getRandomValues(new Uint8Array(32))
      args.push("--node-key", hex.encode(nodeKey))
      const publicKey = await ed25519.getPublicKeyAsync(nodeKey)
      // Peer IDs are derived by hashing the encoded public key with multihash.
      // See https://github.com/libp2p/specs/blob/master/peer-ids/peer-ids.md#peer-ids
      // For any 32 byte ed25519 public key the first 6 bytes are always [0, 36, 8, 1, 18, 32]
      // PeerId = [0, 36, 8, 1, 18, 32, ...publicKey]
      //                  -------------------------- > protobuf encoded ed25519 public key (36 bytes)
      //           --------------------------------- > identity multihash of the protobuf encoded ed25519 public key (38 bytes)
      const peerId = base58.encode(new Uint8Array([0, 36, 8, 1, 18, 32, ...publicKey]))
      bootnodes = `/ip4/127.0.0.1/tcp/${httpPort}/p2p/${peerId}`
    }
    args.push(...extraArgs)
    spawnNode(nodeDir, binary, args, signal)
    await portReady(wsPort)
  }
  if (!bootnodes) throw new Error("count must be > 1")
  return { bootnodes, ports }
}

async function spawnNode(tempDir: string, binary: string, args: string[], signal: AbortSignal) {
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
