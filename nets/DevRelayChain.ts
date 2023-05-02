import {
  addAuthorities,
  addDevUsers,
  addXcmHrmpChannels,
  createCustomChainSpec,
  GenesisConfig,
  getGenesisConfig,
} from "./chain_spec/mod.ts"
import { BinaryGetter, DevNet, SpawnDevNetResult } from "./DevNet.ts"
import { DevParachain } from "./DevParachain.ts"

export class DevRelayChain extends DevNet {
  parachains: DevParachain[] = []

  parachain(binary: BinaryGetter, chain: string, id: number, nodes?: number) {
    return new DevParachain(this, binary, chain, id, nodes)
  }

  preflightNetworkArgs() {
    return Promise.resolve([])
  }

  parachainInfo(signal: AbortSignal, tempParentDir: string) {
    return Promise.all(
      this.parachains.map((parachain) => parachain.parachainInfo(signal, tempParentDir)),
    )
  }

  async chainSpecPath(signal: AbortSignal, tempParentDir: string) {
    const [parachainInfo, binary] = await Promise.all([
      this.parachainInfo(signal, tempParentDir),
      this.binary(signal),
    ])
    const minValidators = Math.max(2, parachainInfo.length)
    const tempDir = this.tempDir(tempParentDir)
    return createCustomChainSpec(tempDir, binary, this.chain, (chainSpec) => {
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

  async spawn(signal: AbortSignal, tempParentDir: string): Promise<SpawnDevNetResult> {
    const tempDir = this.tempDir(tempParentDir)
    const [chainSpecPath, parachainInfo, binary] = await Promise.all([
      this.chainSpecPath(signal, tempParentDir),
      this.parachainInfo(signal, tempParentDir),
      this.binary(signal),
    ])
    const nodeCount = this.nodeCount ?? Math.max(2, parachainInfo.length)
    return await this.spawnDevNet({
      tempDir,
      binary,
      chainSpecPath,
      nodeCount,
      extraArgs: [],
      signal,
    })
  }
}
