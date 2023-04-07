import { ensureDir } from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

export async function createCustomChainSpec(
  tempDir: string,
  binary: string,
  chain: string,
  customize: (chainSpec: ChainSpec) => void,
) {
  await ensureDir(tempDir)

  const specResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain],
  }).output()
  if (!specResult.success) {
    // TODO: improve error message
    throw new Error("build-spec failed")
  }
  const spec = JSON.parse(new TextDecoder().decode(specResult.stdout))
  customize(spec)

  const specPath = path.join(tempDir, `chainspec.json`)
  await Deno.writeTextFile(specPath, JSON.stringify(spec, undefined, 2))

  const rawResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", specPath, "--raw"],
  }).output()
  if (!rawResult.success) {
    // TODO: improve error message
    throw new Error("build-spec --raw failed")
  }

  const rawPath = path.join(tempDir, `chainspec-raw.json`)
  await Deno.writeFile(rawPath, rawResult.stdout)

  return rawPath
}

export function getGenesisConfig(chainSpec: ChainSpec) {
  return chainSpec.genesis.runtime.runtime_genesis_config ?? chainSpec.genesis.runtime
}

export interface ChainSpec {
  bootNodes: string[]
  para_id?: number
  genesis: {
    runtime:
      | { runtime_genesis_config: GenesisConfig }
      | GenesisConfig
  }
}

interface GenesisConfig {
  runtime_genesis_config?: never
  paras: {
    paras: [
      [
        parachainId: number,
        genesis: [state: string, wasm: string, kind: boolean],
      ],
    ]
  }
  parachainInfo: {
    parachainId: number
  }
  balances: {
    balances: [account: string, initialBalance: number][]
  }
}
