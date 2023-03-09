import { ss58, testUser } from "../../crypto/mod.ts"
import { deadline } from "../../deps/std/async.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { ready } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

const DEFAULT_TEST_USER_COUNT = 100_000
const DEFAULT_TEST_USER_INITIAL_FUNDS = 1_000_000_000_000_000_000

export interface FrameBinProviderProps {
  bin: string
  installation: string
  readyTimeout?: number
}

export abstract class FrameBinProvider extends FrameProxyProvider {
  bin
  installation
  timeout

  constructor(env: Env, { bin, installation, readyTimeout }: FrameBinProviderProps) {
    super(env)
    this.bin = bin
    this.installation = installation
    this.timeout = readyTimeout ?? 60 * 1000
  }

  abstract launch(pathInfo: PathInfo): Promise<number>

  dynamicUrlMemo = new PermanentMemo<string, string>()
  async dynamicUrl(pathInfo: PathInfo) {
    return this.dynamicUrlMemo.run(pathInfo.target ?? "", () =>
      deadline(
        (async () => {
          const port = await this.launch(pathInfo)
          await ready(port)
          return `ws://localhost:${port}`
        })(),
        this.timeout,
      ))
  }

  async runBin(args: string[]): Promise<Deno.ChildProcess> {
    await this.assertBinValid()
    const command = new Deno.Command(this.bin, {
      args,
      stdout: "piped",
      stderr: "piped",
    })
    const process = command.spawn()
    this.env.signal.addEventListener("abort", () => process.kill("SIGINT"))
    return process
  }

  binValid?: Promise<void>
  assertBinValid() {
    return this.binValid ??= (async () => {
      const whichProcess = new Deno.Command("which", {
        args: [this.bin],
        stdout: "piped",
      })
      const { stdout } = await whichProcess.output()
      if (!stdout.length) {
        throw new Error(
          `No such bin "${this.bin}" in path. Installation instructions can be found here: "${this.installation}"`,
        )
      }
    })()
  }

  async createCustomChainSpec(
    chain: string,
    networkPrefix: number,
  ): Promise<string> {
    const buildSpecCmd = new Deno.Command(
      this.bin,
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
      prefix: `custom-${chain}-chain-spec-raw`,
      suffix: ".json",
    })
    await Deno.writeTextFile(customChainSpecRawPath, JSON.stringify(chainSpecRaw, undefined, 2))
    return customChainSpecRawPath
  }
}
