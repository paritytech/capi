import {
  addDevUsers,
  createCustomChainSpec,
  exportParachainGenesis,
  getGenesisConfig,
} from "./chain_spec/mod.ts"
import { BinaryGetter, DevNet, SpawnDevNetResult } from "./DevNet.ts"
import { DevRelayChain } from "./DevRelayChain.ts"

export class DevParachain extends DevNet {
  constructor(
    readonly relayChain: DevRelayChain,
    binary: BinaryGetter,
    chain: string,
    readonly id: number,
    nodeCount: number = 2,
  ) {
    super(binary, chain, nodeCount)
    relayChain.parachains.push(this)
  }

  async preflightNetworkArgs(signal: AbortSignal, tempParentDir: string) {
    const relayChainSpecPath = await this.relayChain.rawChainSpecPath(signal, tempParentDir)
    return ["--", "--execution", "wasm", "--chain", relayChainSpecPath]
  }

  async parachainInfo(signal: AbortSignal, tempParentDir: string) {
    const tempDir = this.tempDir(tempParentDir)
    const binary = await this.binary(signal)
    const chainSpecPath = await createCustomChainSpec(tempDir, binary, this.chain, (chainSpec) => {
      chainSpec.para_id = this.id
      const genesisConfig = getGenesisConfig(chainSpec)
      genesisConfig.parachainInfo.parachainId = this.id
      addDevUsers(genesisConfig.balances.balances)
    })
    const genesis = await exportParachainGenesis(binary, chainSpecPath, signal)
    return { id: this.id, chainSpecPath, genesis }
  }

  async spawn(signal: AbortSignal, tempParentDir: string): Promise<SpawnDevNetResult> {
    const tempDir = this.tempDir(tempParentDir)
    const [{ chainSpecPath }, relayChainSpecPath, relayChain] = await Promise.all([
      this.parachainInfo(signal, tempParentDir),
      this.relayChain.chainSpecPath(signal, tempParentDir),
      this.relayChain.spawn(signal, tempParentDir),
    ])
    const nodeCount = this.nodeCount ?? 2
    return await this.spawnDevNet({
      tempDir,
      binary: await this.binary(signal),
      chainSpecPath,
      nodeCount,
      extraArgs: [
        "--",
        "--execution",
        "wasm",
        "--chain",
        relayChainSpecPath,
        "--bootnodes",
        relayChain.bootnodes,
      ],
      signal,
    })
  }
}

export interface ParachainInfo {
  id: number
  chainSpecPath: string
  genesis: [state: string, wasm: string]
}
