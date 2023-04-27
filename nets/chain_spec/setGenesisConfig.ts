import { ChainSpec, GenesisConfig } from "./ChainSpec.ts"

export function setGenesisConfig(chainSpec: ChainSpec, genesisConfig: GenesisConfig) {
  if (chainSpec.genesis.runtime.runtime_genesis_config) {
    chainSpec.genesis.runtime.runtime_genesis_config = genesisConfig
  } else {
    chainSpec.genesis.runtime = genesisConfig
  }
}
