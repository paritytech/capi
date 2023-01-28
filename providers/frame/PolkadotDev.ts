import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
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

  async spawnDevNet(runtimeName: DevRuntimeName) {
    const port = getAvailable()
    const cmd: string[] = [this.bin, "--dev", "--ws-port", port.toString(), ...this.additional]
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
