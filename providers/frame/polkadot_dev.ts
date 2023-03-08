import { ss58, testPair } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
}

const TEST_USER_COUNT = 1000
const TEST_USER_INITIAL_FUNDS = 1000000000000000000
const DEV_RUNTIME_PREFIXES = {
  polkadot: 0,
  kusama: 2,
  westend: 42,
  rococo: 42,
} as const

export class PolkadotDevProvider extends FrameBinProvider {
  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps = {}) {
    super(env, {
      bin: polkadotPath ?? "polkadot",
      installation: "https://github.com/paritytech/polkadot",
      readyTimeout: 60 * 1000,
    })
  }

  async launch(pathInfo: PathInfo) {
    const runtimeName = pathInfo.target || "polkadot"
    $.assert($devRuntimeName, runtimeName)
    const port = getAvailable()
    const chainSpec = await this.#getCustomChainSpec(runtimeName)
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(args)
    return port
  }

  async #getCustomChainSpec(
    runtimeName: "polkadot" | "kusama" | "westend" | "rococo",
  ): Promise<string> {
    const buildSpecCmd = new Deno.Command(
      this.bin,
      {
        args: [
          "build-spec",
          "--disable-default-bootnode",
          "--chain",
          `${runtimeName}-dev`,
        ],
      },
    )
    const chainSpec = JSON.parse(new TextDecoder().decode((await buildSpecCmd.output()).stdout))
    const balances: any[] = chainSpec.genesis.runtime.balances.balances
    for (let i = 0; i < TEST_USER_COUNT; i++) {
      balances.push([
        ss58.encode(DEV_RUNTIME_PREFIXES[runtimeName], testPair(i).publicKey),
        TEST_USER_INITIAL_FUNDS,
      ])
    }
    const customChainSpecPath = await Deno.makeTempFile({
      prefix: `custom-${runtimeName}-chain-spec`,
      suffix: ".json",
    })
    await Deno.writeTextFile(customChainSpecPath, JSON.stringify(chainSpec, undefined, 2))
    const buildSpecRawCmd = new Deno.Command(
      this.bin,
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
      prefix: `custom-${runtimeName}-chain-spec-raw`,
      suffix: ".json",
    })
    await Deno.writeTextFile(customChainSpecRawPath, JSON.stringify(chainSpecRaw, undefined, 2))
    return customChainSpecRawPath
  }
}

const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])
