import { Binary } from "./binary.ts"
import {
  addAuthorities,
  addXcmHrmpChannels,
  createCustomChainSpec,
  GenesisConfig,
  getGenesisConfig,
} from "./chain_spec.ts"
import { addDevUsers } from "./dev_users.ts"
import { DevNet } from "./DevNet.ts"
import { Parachain, ParachainInfo } from "./Parachain.ts"
import { spawnDevNet, SpawnDevNetResult } from "./spawnDevNet.ts"

export class RelayChain extends DevNet {
  parachains: Parachain[] = []

  parachain(binary: Binary, chain: string, id: number, nodes?: number) {
    return new Parachain(this, binary, chain, id, nodes)
  }

  preflightNetworkArgs() {
    return Promise.resolve([])
  }

  _parachainInfo?: Promise<ParachainInfo[]>
  parachainInfo(signal: AbortSignal, tempParentDir: string) {
    if (!this._parachainInfo) {
      this._parachainInfo = Promise.all(
        this.parachains.map((parachain) => parachain.parachainInfo(signal, tempParentDir)),
      )
    }
    return this._parachainInfo
  }

  async chainSpecPath(signal: AbortSignal, tempParentDir: string) {
    const parachainInfo = await this.parachainInfo(signal, tempParentDir)
    const minValidators = Math.max(2, parachainInfo.length)
    const tempDir = this.tempDir(tempParentDir)
    const binaryPath = await this.binaryPath(signal)
    return createCustomChainSpec(tempDir, binaryPath, this.chain, (chainSpec) => {
      const genesisConfig = getGenesisConfig(chainSpec)
      if (parachainInfo.length) {
        genesisConfig.paras.paras.push(
          ...parachainInfo.map((
            { id, genesis },
          ): GenesisConfig["paras"]["paras"][number] => [id, [...genesis, true]]),
        )
        addXcmHrmpChannels(genesisConfig, parachainInfo.map(({ id }) => id))
      }
      addAuthorities(genesisConfig, minValidators)
      addDevUsers(genesisConfig.balances.balances)
    })
  }

  _network?: Promise<SpawnDevNetResult>
  override spawn = async (
    signal: AbortSignal,
    tempParentDir: string,
  ): Promise<SpawnDevNetResult> => {
    if (!this._network) {
      const tempDir = this.tempDir(tempParentDir)
      this._network = (async () => {
        const [binaryPath, chainSpecPath, parachainInfo] = await Promise.all([
          this.binaryPath(signal),
          this.chainSpecPath(signal, tempParentDir),
          this.parachainInfo(signal, tempParentDir),
        ])
        const nodeCount = this.nodeCount ?? Math.max(2, parachainInfo.length)
        return spawnDevNet({
          tempDir,
          binaryPath,
          chainSpecPath,
          nodeCount,
          extraArgs: [],
          signal,
        })
      })()
    }
    return this._network
  }
}
