import { ss58, testUser } from "../../../crypto/mod.ts"

const DEFAULT_TEST_USER_COUNT = 10
const DEFAULT_TEST_USER_INITIAL_FUNDS = 1000000000000000000

export interface CreateCustomChainSpecProps {
  binary: string
  chain: string
  testUserAccountProps: {
    networkPrefix: number
    initialFunds?: number
    count?: number
  }
}

export async function createCustomChainSpec({
  binary,
  chain,
  testUserAccountProps,
}: CreateCustomChainSpecProps): Promise<string> {
  const buildSpecCmd = new Deno.Command(
    binary,
    {
      args: [
        "build-spec",
        "--disable-default-bootnode",
        "--chain",
        chain,
      ],
    },
  )
  const chainSpec = JSON.parse(new TextDecoder().decode((await buildSpecCmd.output()).stdout))
  const balances: any[] = chainSpec.genesis.runtime.balances.balances
  const initialFunds = testUserAccountProps.initialFunds ?? DEFAULT_TEST_USER_INITIAL_FUNDS
  const count = testUserAccountProps.count ?? DEFAULT_TEST_USER_COUNT
  for (let i = 0; i < count; i++) {
    balances.push([
      ss58.encode(testUserAccountProps.networkPrefix, testUser(i).publicKey),
      initialFunds,
    ])
  }
  const customChainSpecPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecPath, JSON.stringify(chainSpec, undefined, 2))
  const buildSpecRawCmd = new Deno.Command(
    binary,
    {
      args: [
        "build-spec",
        "--disable-default-bootnode",
        "--chain",
        customChainSpecPath,
        "--raw",
      ],
    },
  )
  const chainSpecRaw = JSON.parse(
    new TextDecoder().decode((await buildSpecRawCmd.output()).stdout),
  )
  const customChainSpecRawPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec-raw`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecRawPath, JSON.stringify(chainSpecRaw, undefined, 2))
  return customChainSpecRawPath
}
