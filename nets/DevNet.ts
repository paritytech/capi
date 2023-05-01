import * as path from "../deps/std/path.ts"
import { Binary, resolveBinary } from "./binary.ts"
import { createRawChainSpec } from "./chain_spec.ts"
import { getMetadataFromWsUrl, Net } from "./Net.ts"
import { spawnDevNet } from "./spawnDevNet.ts"

export abstract class DevNet extends Net {
  constructor(readonly binary: Binary, readonly chain: string, readonly nodeCount?: number) {
    super()
  }

  connection(name: string) {
    return {
      type: "DevnetConnection" as const,
      discovery: name,
    }
  }

  _binaryPath?: Promise<string>
  binaryPath(signal: AbortSignal) {
    if (!this._binaryPath) this._binaryPath = resolveBinary(this.binary, signal)
    return this._binaryPath
  }

  _tempDir?: string
  tempDir(parentDir: string) {
    if (!this._tempDir) this._tempDir = path.join(parentDir, crypto.randomUUID())
    return this._tempDir
  }

  _rawChainSpecPath?: Promise<string>
  rawChainSpecPath(signal: AbortSignal, tempParentDir: string) {
    if (!this._rawChainSpecPath) {
      this._rawChainSpecPath = (async () => {
        const binary = await this.binaryPath(signal)
        return createRawChainSpec(this.tempDir(tempParentDir), binary, this.chain)
      })()
    }
    return this._rawChainSpecPath
  }

  async preflightNetwork(signal: AbortSignal, tempParentDir: string) {
    const [binaryPath, chainSpecPath, extraArgs] = await Promise.all([
      this.binaryPath(signal),
      this.rawChainSpecPath(signal, tempParentDir),
      this.preflightNetworkArgs(signal, tempParentDir),
    ])
    return spawnDevNet({
      tempDir: this.tempDir(tempParentDir),
      binaryPath,
      chainSpecPath,
      nodeCount: 1,
      extraArgs,
      signal,
    })
  }

  abstract preflightNetworkArgs(signal: AbortSignal, tempParentDir: string): Promise<string[]>

  _metadata?: Promise<Uint8Array>
  metadata(signal: AbortSignal, tempParentDir: string) {
    if (!this._metadata) {
      this._metadata = (async () => {
        const { ports: [port0] } = await this.preflightNetwork(signal, tempParentDir)
        return getMetadataFromWsUrl(`ws://127.0.0.1:${port0}`)
      })()
    }
    return this._metadata
  }
}
