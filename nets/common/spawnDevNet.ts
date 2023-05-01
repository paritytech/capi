import { hex } from "../../crypto/mod.ts"
import * as ed25519 from "../../deps/ed25519.ts"
import * as base58 from "../../deps/std/encoding/base58.ts"
import * as path from "../../deps/std/path.ts"
import { writableStreamFromWriter } from "../../deps/std/streams.ts"
import { getFreePort, portReady } from "../../util/port.ts"

export interface SpawnDevNetProps {
  tempDir: string
  binary: string
  chainSpecPath: string
  nodeCount: number
  extraArgs: string[]
  signal: AbortSignal
}

export interface SpawnDevNetResult {
  bootnodes: string
  ports: number[]
}

export async function spawnDevNet(
  { tempDir, binary, chainSpecPath, nodeCount, extraArgs, signal }: SpawnDevNetProps,
): Promise<SpawnDevNetResult> {
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
      bootnodes = await generateBootnodeString(httpPort, nodeKey)
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

const keystoreAccounts = ["alice", "bob", "charlie", "dave", "eve", "ferdie"]

async function generateBootnodeString(port: number, privateKey: Uint8Array) {
  const publicKey = await ed25519.getPublicKeyAsync(privateKey)
  // Peer IDs are derived by hashing the encoded public key with multihash.
  // See https://github.com/libp2p/specs/blob/master/peer-ids/peer-ids.md#peer-ids
  // For any 32 byte ed25519 public key the first 6 bytes are always [0, 36, 8, 1, 18, 32]
  // PeerId = [0, 36, 8, 1, 18, 32, ...publicKey]
  //                  -------------------------- > protobuf encoded ed25519 public key (36 bytes)
  //           --------------------------------- > identity multihash of the protobuf encoded ed25519 public key (38 bytes)
  const peerId = base58.encode(new Uint8Array([0, 36, 8, 1, 18, 32, ...publicKey]))
  return `/ip4/127.0.0.1/tcp/${port}/p2p/${peerId}`
}
