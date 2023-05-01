import * as path from "../deps/std/path.ts"
import { createRawChainSpec } from "./common/chain_spec.ts"
import { spawnDevNet } from "./common/spawnDevNet.ts"
import { getMetadataFromWsUrl, Net } from "./Net.ts"

export abstract class DevNet extends Net {
  constructor(readonly binary: BinaryGetter, readonly chain: string, readonly nodeCount?: number) {
    super()
  }

  connection(name: string) {
    return {
      type: "DevnetConnection" as const,
      discovery: name,
    }
  }

  _tempDir?: string
  tempDir(parentDir: string) {
    if (!this._tempDir) this._tempDir = path.join(parentDir, crypto.randomUUID())
    return this._tempDir
  }

  _rawChainSpecPath?: Promise<string>
  rawChainSpecPath(signal: AbortSignal, devnetTempDir: string) {
    if (!this._rawChainSpecPath) {
      this._rawChainSpecPath = (async () => {
        return createRawChainSpec(
          this.tempDir(devnetTempDir),
          await this.binary(signal),
          this.chain,
        )
      })()
    }
    return this._rawChainSpecPath
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

  abstract preflightNetworkArgs(signal: AbortSignal, devnetTempDir: string): Promise<string[]>

  _metadata?: Promise<Uint8Array>
  metadata(signal: AbortSignal, devnetTempDir: string) {
    if (!this._metadata) {
      this._metadata = (async () => {
        const { ports: [port0] } = await this.preflightNetwork(signal, devnetTempDir)
        return getMetadataFromWsUrl(`ws://127.0.0.1:${port0}`)
      })()
    }
    return this._metadata
  }
}

export type BinaryGetter = (signal: AbortSignal) => Promise<string>
