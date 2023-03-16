import { ss58 } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"

export const DEFAULT_TEST_USER_COUNT = 100_000
const DEFAULT_TEST_USER_INITIAL_FUNDS = 1_000_000_000_000_000_000
export const publicKeysFileUrl = import.meta.resolve("./test_users_public_keys.scale")

export async function createCustomChainSpec(
  bin: string,
  chain: string,
  networkPrefix: number,
): Promise<string> {
  const buildSpecCmd = new Deno.Command(bin, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain],
  })
  const chainSpec = JSON.parse(new TextDecoder().decode((await buildSpecCmd.output()).stdout))
  const balances: [string, number][] = chainSpec.genesis.runtime.balances.balances
  const publicKeys = $.array($.sizedUint8Array(32)).decode(
    new Uint8Array(await (await fetch(publicKeysFileUrl)).arrayBuffer()),
  )
  for (let i = 0; i < DEFAULT_TEST_USER_COUNT; i++) {
    balances.push([ss58.encode(networkPrefix, publicKeys[i]!), DEFAULT_TEST_USER_INITIAL_FUNDS])
  }
  const customChainSpecPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecPath, JSON.stringify(chainSpec, undefined, 2))
  const buildSpecRawCmd = new Deno.Command(bin, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", customChainSpecPath, "--raw"],
  })
  const chainSpecRaw = JSON.parse(new TextDecoder().decode((await buildSpecRawCmd.output()).stdout))
  const customChainSpecRawPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec-raw`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecRawPath, JSON.stringify(chainSpecRaw, undefined, 2))
  return customChainSpecRawPath
}

export function connectionCodeWithUsers(
  code: string,
  isTypes: boolean,
  url: string,
): string {
  return `
${code}

export const users ${
    isTypes
      ? `: ReturnType<typeof C.testUserFactory>`
      : `= C.testUserFactory(${JSON.stringify(url)})`
  }
  `
}

export async function handleCount(request: Request, cache: { count: number }): Promise<Response> {
  const body = await request.json()
  $.assert($.field("count", $.u32), body)
  const { count } = body
  const index = cache.count
  const newCount = index + count
  if (newCount < DEFAULT_TEST_USER_COUNT) cache.count = newCount
  else throw new Error("Maximum test user count reached")
  return new Response(JSON.stringify({ index }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
