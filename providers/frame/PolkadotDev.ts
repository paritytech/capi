import { File, FrameCodegen } from "../../codegen/mod.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo, ss58, testUser } from "../../util/mod.ts"
import { getAvailable, isReady } from "../../util/port.ts"
import { FrameProxyProvider } from "./ProxyBase.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
  additional?: string[]
}

export class PolkadotDevProvider extends FrameProxyProvider {
  providerId = "dev"
  bin
  additional

  constructor(env: Env, { polkadotPath, additional }: PolkadotDevProviderProps = {}) {
    super(env)
    this.bin = polkadotPath ?? "polkadot"
    this.additional = additional ?? []
  }

  urlMemo = new PermanentMemo<DevRuntimeName, string>()
  url(pathInfo: PathInfo) {
    const { target } = pathInfo
    assertDevRuntimeName(target)
    return this.urlMemo.run(target, async () => {
      const port = await this.spawnDevNet(target)
      return `ws://localhost:${port}`
    })
  }

  async chainSpec(runtimeName: DevRuntimeName) {
    const cmd: string[] = ["polkadot", "build-spec", "--dev"]
    if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
    const chainSpecProcess = Deno.run({ cmd, stdout: "piped", stderr: "piped" })
    const chainSpec = JSON.parse(new TextDecoder().decode(await chainSpecProcess.output()))
    const testUsers = Array.from({ length: TEST_USER_COUNT }, (_, i) => testUser(i))
    chainSpec.genesis.runtime.balances.balances = testUsers.map(({ publicKey }) => [
      ss58.encode(42, publicKey),
      TEST_USER_INITIAL_FUNDS,
    ])
    return chainSpec
  }

  override onCodegenInit(codegen: FrameCodegen) {
    const code = `
      import { Sr25519, testUser } from "./capi.ts"

      export const users: [${Array(TEST_USER_COUNT).fill("Sr25519").join(", ")}] = [${
      Array.from({ length: TEST_USER_COUNT }, (_, i) => `testUser(${i})`).join(",\n")
    }]

      let i = 0
      export function nextUser(): Sr25519 {
        if (i === ${
      TEST_USER_COUNT - 1
    }) throw new Error("Exceeded max test user count of ${TEST_USER_COUNT}")
        i++
        return testUser(i)
      }
    `
    codegen.files.set("users.ts", new File(code))
    const modFile = codegen.files.get("mod.ts")!
    // TODO: rework this upon reworking `File` (something like `modFile.reexport("users.ts", "users")`)
    modFile.codeRaw = `
      export { users, nextUser } from "./users.ts"
      ${modFile.codeRaw}
    `
  }

  async spawnDevNet(runtimeName: DevRuntimeName) {
    const chainSpecPath = await Deno.makeTempFile()
    await Deno.writeTextFile(chainSpecPath, JSON.stringify(await this.chainSpec(runtimeName)))
    const port = getAvailable()
    const cmd: string[] = [
      this.bin,
      "--chain",
      chainSpecPath,
      "--ws-port",
      port.toString(),
      ...this.additional,
    ]
    if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
    if (this.additional) cmd.push(...this.additional)
    try {
      const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
      })
      this.env.signal.addEventListener("abort", async () => {
        process.kill("SIGINT")
        await process.status()
        process.close()
      })
    } catch (_e) {
      throw new Error( // TODO: auto installation prompt?
        "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
          + ` For more information, visit the following link: "https://github.com/paritytech/polkadot".`,
      )
    }
    await isReady(port)
    return port
  }
}

export const DEV_RUNTIME_NAMES = ["polkadot", "kusama", "westend", "rococo"] as const
export type DevRuntimeName = typeof DEV_RUNTIME_NAMES[number]

export function assertDevRuntimeName(inQuestion: string): asserts inQuestion is DevRuntimeName {
  if (!(DEV_RUNTIME_NAME_EXISTS as Record<string, true>)[inQuestion]) throw new Error()
}
const DEV_RUNTIME_NAME_EXISTS: Record<DevRuntimeName, true> = {
  polkadot: true,
  kusama: true,
  westend: true,
  rococo: true,
}

const TEST_USER_COUNT = 100
const TEST_USER_INITIAL_FUNDS = 10_000_000_000_000
