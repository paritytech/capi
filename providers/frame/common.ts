import { File } from "../../codegen/frame/mod.ts"
import { ss58, testUser } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"

const DEFAULT_TEST_USER_COUNT = 100_000
const DEFAULT_TEST_USER_INITIAL_FUNDS = 1_000_000_000_000_000_000

export async function createCustomChainSpec(
  bin: string,
  chain: string,
  networkPrefix: number,
): Promise<string> {
  const buildSpecCmd = new Deno.Command(bin, {
    args: [
      "build-spec",
      "--disable-default-bootnode",
      "--chain",
      chain,
    ],
  })
  const chainSpec = JSON.parse(new TextDecoder().decode((await buildSpecCmd.output()).stdout))
  const balances: [string, number][] = chainSpec.genesis.runtime.balances.balances
  for (let i = 0; i < DEFAULT_TEST_USER_COUNT; i++) {
    balances.push([
      ss58.encode(networkPrefix, testUser(i).publicKey),
      DEFAULT_TEST_USER_INITIAL_FUNDS,
    ])
  }
  const customChainSpecPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecPath, JSON.stringify(chainSpec, undefined, 2))
  const buildSpecRawCmd = new Deno.Command(bin, {
    args: [
      "build-spec",
      "--disable-default-bootnode",
      "--chain",
      customChainSpecPath,
      "--raw",
    ],
  })
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

export async function chainFileWithUsers(
  file: File,
  url: string,
): Promise<File> {
  return new File(`
    ${file.codeRaw}

    export const users = C.testUserFactory(${JSON.stringify(url)})
  `)
}

export async function handleCount(
  request: Request,
  cache: { count: number },
): Promise<Response> {
  const body = await request.json()
  $.assert($.field("count", $.u32), body)
  const { count } = body
  let index = cache.count
  const newCount = index + count
  if (newCount < DEFAULT_TEST_USER_COUNT) {
    cache.count = newCount
  } else {
    index = -1
  }
  return new Response(
    JSON.stringify({ index }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  )
}
