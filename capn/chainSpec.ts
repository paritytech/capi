import { ss58 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { resolveBinary } from "./binary.ts"
import { BinaryChain } from "./mod.ts"

export const DEFAULT_TEST_USER_COUNT = 100_000
const DEFAULT_TEST_USER_INITIAL_FUNDS = 1_000_000_000_000_000_000
export const publicKeysUrl = import.meta.resolve("./test_users_public_keys.scale")

export async function createCustomChainSpec(
  { binary, chain }: BinaryChain,
  signal: AbortSignal,
): Promise<string> {
  const bin = await resolveBinary(binary, signal)
  const buildSpecCmd = new Deno.Command(bin, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain],
    signal,
  })
  const chainSpec = JSON.parse(new TextDecoder().decode((await buildSpecCmd.output()).stdout))
  const balances: [string, number][] = chainSpec.genesis.runtime.balances.balances
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  const publicKeys = $.array($.sizedUint8Array(32)).decode(
    new Uint8Array(await (await fetch(publicKeysUrl)).arrayBuffer()),
  )
  for (let i = 0; i < DEFAULT_TEST_USER_COUNT; i++) {
    balances.push([ss58.encode(networkPrefix, publicKeys[i]!), DEFAULT_TEST_USER_INITIAL_FUNDS])
  }
  const customChainSpecPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecPath, JSON.stringify(chainSpec))
  const buildSpecRawCmd = new Deno.Command(bin, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", customChainSpecPath, "--raw"],
    signal,
  })
  const chainSpecRaw = JSON.parse(new TextDecoder().decode((await buildSpecRawCmd.output()).stdout))
  const customChainSpecRawPath = await Deno.makeTempFile({
    prefix: `custom-${chain}-chain-spec-raw`,
    suffix: ".json",
  })
  await Deno.writeTextFile(customChainSpecRawPath, JSON.stringify(chainSpecRaw))
  return customChainSpecRawPath
}
