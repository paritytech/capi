import { Narrow } from "../deps/scale.ts"
import {
  addAuthorities,
  addDevUsers,
  addXcmHrmpChannels,
  createCustomChainSpec,
  getGenesisConfig,
} from "./chain_spec/mod.ts"
import { DevNet, DevNetSpec, spawnDevNet } from "./DevNetSpec.ts"
import { DevParachainProps, DevParachainSpec, ParachainInfo } from "./DevParachainSpec.ts"

export class DevRelaySpec extends DevNetSpec {
  parachains: DevParachainSpec[] = []
  relay = this

  parachain(props: DevParachainProps) {
    const para = new DevParachainSpec(this, props)
    this.parachains.push(para)
    return para
  }

  async preflightNetworkArgs() {
    return []
  }

  async chainSpecPath(
    signal: AbortSignal,
    rootTempDir: string,
    parachainsInfo: ParachainInfo[],
  ) {
    const binary = await this.binary(signal)
    const minValidators = Math.max(2, parachainsInfo.length)
    const tempDir = this.tempDir(rootTempDir)
    return createCustomChainSpec(tempDir, binary, this.chain, (chainSpec) => {
      const genesisConfig = getGenesisConfig(chainSpec)
      if (parachainsInfo.length) {
        genesisConfig.paras?.paras.push(
          ...parachainsInfo.map(({ id, genesis: [state, wasm] }) =>
            [id, [state, wasm, true]] satisfies Narrow
          ),
        )
        addXcmHrmpChannels(genesisConfig, parachainsInfo.map(({ id }) => id))
      }
      addAuthorities(genesisConfig, minValidators)
      addDevUsers(genesisConfig)
      this.customize?.(chainSpec)
    })
  }

  async spawnNet(signal: AbortSignal, rootTempDir: string): Promise<Map<DevNetSpec, DevNet>> {
    const relayTempDir = this.tempDir(rootTempDir)
    const parachainsInfo = await Promise.all(
      this.parachains.map((parachain) => parachain.parachainInfo(signal, rootTempDir)),
    )
    const [relayChainSpecPath, binary] = await Promise.all([
      this.chainSpecPath(signal, rootTempDir, parachainsInfo),
      this.binary(signal),
    ])
    const nodeCount = this.nodeCount ?? Math.max(2, parachainsInfo.length)
    const relayChain = await spawnDevNet({
      tempDir: relayTempDir,
      binary,
      chainSpecPath: relayChainSpecPath,
      nodeCount,
      extraArgs: [],
      signal,
    })
    return new Map<DevNetSpec, DevNet>([
      [this, relayChain],
      ...await Promise.all(
        this.parachains.map(
          async (parachain, i): Promise<[DevParachainSpec, DevNet]> => {
            const parachainInfo = parachainsInfo[i]!
            const tempDir = parachain.tempDir(relayTempDir)
            const nodeCount = parachain.nodeCount ?? 2
            const chain = await spawnDevNet({
              tempDir,
              binary: await parachain.binary(signal),
              chainSpecPath: parachainInfo.chainSpecPath,
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
            return [parachain, chain]
          },
        ),
      ),
    ])
  }
}
