import { ChainSpec } from "./ChainSpec.ts"

export function getGenesisConfig(chainSpec: ChainSpec) {
  return chainSpec.genesis.runtime.runtime_genesis_config ?? chainSpec.genesis.runtime
}
