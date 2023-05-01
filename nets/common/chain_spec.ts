import { ensureDir } from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"

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
  return createRawChainSpec(tempDir, binary, specPath)
}

export async function createRawChainSpec(tempDir: string, binary: string, chain: string) {
  await ensureDir(tempDir)
  const rawResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain, "--raw"],
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

interface SessionKey {
  grandpa: string
  babe: string
  im_online: string
  para_validator: string
  para_assignment: string
  authority_discovery: string
  beefy: string
}

export interface GenesisConfig {
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
  session?: {
    keys: [account: string, account: string, key: SessionKey][]
  }
  hrmp?: {
    preopenHrmpChannels: [
      senderParaId: number,
      recipientParaId: number,
      maxCapacity: number,
      maxMessageSize: number,
    ][]
  }
}

const hrmpChannelMaxCapacity = 8
const hrmpChannelMaxMessageSize = 512
export function addXcmHrmpChannels(genesisConfig: GenesisConfig, paraIds: number[]) {
  genesisConfig.hrmp ??= { preopenHrmpChannels: [] }
  for (const senderParaId of paraIds) {
    for (const recipientParaId of paraIds) {
      if (senderParaId === recipientParaId) continue
      genesisConfig.hrmp.preopenHrmpChannels.push([
        senderParaId,
        recipientParaId,
        hrmpChannelMaxCapacity,
        hrmpChannelMaxMessageSize,
      ])
    }
  }
}

const authorities = [
  {
    name: "alice",
    srAccount: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    srStash: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    edAccount: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
    // cspell:disable-next-line
    ecAccount: "KW39r9CJjAVzmkf9zQ4YDb2hqfAVGdRqn53eRqyruqpxAP5YL",
  },
  {
    name: "bob",
    srAccount: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    srStash: "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    edAccount: "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
    // cspell:disable-next-line
    ecAccount: "KWByAN7WfZABWS5AoWqxriRmF5f2jnDqy3rB5pfHLGkY93ibN",
  },
  {
    name: "charlie",
    srAccount: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    srStash: "5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT",
    edAccount: "5DbKjhNLpqX3zqZdNBc9BGb4fHU1cRBaDhJUskrvkwfraDi6",
    // cspell:disable-next-line
    ecAccount: "KWBpGtyJLBkJERdZT1a1uu19c2uPpZm9nFd8SGtCfRUAT3Y4w",
  },
  {
    name: "dave",
    srAccount: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    srStash: "5HKPmK9GYtE1PSLsS1qiYU9xQ9Si1NcEhdeCq9sw5bqu4ns8",
    edAccount: "5ECTwv6cZ5nJQPk6tWfaTrEk8YH2L7X1VT4EL5Tx2ikfFwb7",
    // cspell:disable-next-line
    ecAccount: "KWCycezxoy7MWTTqA5JDKxJbqVMiNfqThKFhb5dTfsbNaGbrW",
  },
  {
    name: "eve",
    srAccount: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
    srStash: "5FCfAonRZgTFrTd9HREEyeJjDpT397KMzizE6T3DvebLFE7n",
    edAccount: "5Ck2miBfCe1JQ4cY3NDsXyBaD6EcsgiVmEFTWwqNSs25XDEq",
    // cspell:disable-next-line
    ecAccount: "KW9NRAHXUXhBnu3j1AGzUXs2AuiEPCSjYe8oGan44nwvH5qKp",
  },
  {
    name: "ferdie",
    srAccount: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
    srStash: "5CRmqmsiNFExV6VbdmPJViVxrWmkaXXvBrSX8oqBT8R9vmWk",
    edAccount: "5E2BmpVFzYGd386XRCZ76cDePMB3sfbZp5ZKGUsrG1m6gomN",
    // cspell:disable-next-line
    ecAccount: "KW6E1KGr5pqJ9Trgt7eAuA7d7mgpJPydiEDKc2h1aGTEEzYC1",
  },
] as const
export function addAuthorities(genesisConfig: GenesisConfig, count: number) {
  if (count > authorities.length) {
    throw new Error(`authorities count should be <= ${authorities.length}`)
  }
  // TODO: #889 add support for pallet_session, pallet_aura and pallet_grandpa
  if (!genesisConfig.session) return
  genesisConfig.session.keys.length = 0
  authorities.slice(0, count).forEach(({ srAccount, srStash, edAccount, ecAccount }) =>
    genesisConfig.session!.keys.push([srStash, srStash, {
      grandpa: edAccount,
      babe: srAccount,
      im_online: srAccount,
      para_validator: srAccount,
      para_assignment: srAccount,
      authority_discovery: srAccount,
      beefy: ecAccount,
    }])
  )
}

export async function exportParachainGenesis(binary: string, chain: string, signal: AbortSignal) {
  return await Promise.all(["state", "wasm"].map(async (type) => {
    const { success, stdout } = await new Deno.Command(binary, {
      args: [`export-genesis-${type}`, "--chain", chain],
      signal,
    }).output()
    if (!success) {
      // TODO: improve error message
      throw new Error(`export-genesis-${type} failed`)
    }
    return new TextDecoder().decode(stdout)
  })) satisfies string[] as [state: string, wasm: string]
}
