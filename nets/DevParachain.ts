import {
  createCustomChainSpec,
  exportParachainGenesis,
  getGenesisConfig,
} from "./common/chain_spec.ts"
import { addDevUsers } from "./common/dev_users.ts"
import { spawnDevNet, SpawnDevNetResult } from "./common/spawnDevNet.ts"
import { BinaryGetter, DevNet } from "./DevNet.ts"
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

  _parachainInfo?: Promise<ParachainInfo>
  parachainInfo(signal: AbortSignal, tempParentDir: string) {
    if (!this._parachainInfo) {
      this._parachainInfo = (async () => {
        const tempDir = this.tempDir(tempParentDir)
        const binary = await this.binary(signal)
        const chainSpecPath = await createCustomChainSpec(
          tempDir,
          binary,
          this.chain,
          (chainSpec) => {
            chainSpec.para_id = this.id
            const genesisConfig = getGenesisConfig(chainSpec)
            genesisConfig.parachainInfo.parachainId = this.id
            addDevUsers(genesisConfig.balances.balances)
          },
        )
        const genesis = await exportParachainGenesis(binary, chainSpecPath, signal)
        return { id: this.id, chainSpecPath, genesis }
      })()
    }
    return this._parachainInfo
  }

  _network?: Promise<SpawnDevNetResult>
  override spawn = async (
    signal: AbortSignal,
    tempParentDir: string,
  ): Promise<SpawnDevNetResult> => {
    if (!this._network) {
      const tempDir = this.tempDir(tempParentDir)
      this._network = (async () => {
        const [{ chainSpecPath }, relayChainSpecPath, relayChain] = await Promise.all([
          this.parachainInfo(signal, tempParentDir),
          this.relayChain.chainSpecPath(signal, tempParentDir),
          this.relayChain.spawn(signal, tempParentDir),
        ])
        const nodeCount = this.nodeCount ?? 2
        return spawnDevNet({
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
      })()
    }
    return this._network
  }
}

export interface ParachainInfo {
  id: number
  chainSpecPath: string
  genesis: [state: string, wasm: string]
}
