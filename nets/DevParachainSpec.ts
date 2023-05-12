import {
  addDevUsers,
  createCustomChainSpec,
  exportParachainGenesis,
  getGenesisConfig,
} from "./chain_spec/mod.ts"
import { DevNetProps, DevNetSpec } from "./DevNetSpec.ts"
import { DevRelaySpec } from "./DevRelaySpec.ts"

export interface DevParachainProps extends DevNetProps {
  readonly id: number
}

export class DevParachainSpec extends DevNetSpec {
  readonly id
  constructor(readonly relay: DevRelaySpec, props: DevParachainProps) {
    super(props)
    this.id = props.id
  }

  async preflightNetworkArgs(signal: AbortSignal, tempParentDir: string) {
    const relayChainSpecPath = await this.relay.rawChainSpecPath(signal, tempParentDir)
    return ["--", "--execution", "wasm", "--chain", relayChainSpecPath]
  }

  async parachainInfo(signal: AbortSignal, tempParentDir: string): Promise<ParachainInfo> {
    const tempDir = this.tempDir(tempParentDir)
    const binary = await this.binary(signal)
    const chainSpecPath = await createCustomChainSpec(
      tempDir,
      binary,
      this.chain,
      (chainSpec) => {
        chainSpec.para_id = this.id
        const genesisConfig = getGenesisConfig(chainSpec)
        if (genesisConfig.parachainInfo) {
          genesisConfig.parachainInfo.parachainId = this.id
        }
        addDevUsers(genesisConfig)
        this.customize?.(chainSpec)
      },
    )
    const genesis = await exportParachainGenesis(binary, chainSpecPath, signal)
    return { id: this.id, chainSpecPath, genesis }
  }
}

export interface ParachainInfo {
  id: number
  chainSpecPath: string
  genesis: [state: string, wasm: string]
}
