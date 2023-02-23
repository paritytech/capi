import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { getAvailable, isReady } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
}

export class PolkadotDevProvider extends FrameProxyProvider {
  providerId = "dev"
  bin

  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps = {}) {
    super(env)
    this.bin = polkadotPath ?? "polkadot"
  }

  urlMemo = new PermanentMemo<DevRuntimeName, string>()
  dynamicUrl(pathInfo: PathInfo) {
    const { target } = pathInfo
    $.assert($devRuntimeName, target)
    return this.urlMemo.run(target, async () => {
      const port = await this.spawnDevNet(target)
      return `ws://localhost:${port}`
    })
  }

  async spawnDevNet(runtimeName: DevRuntimeName) {
    const port = getAvailable()
    const cmd: string[] = [this.bin, "--dev", "--ws-port", port.toString()]
    if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
    try {
      const process = Deno.run({
        cmd,
        stdout: "null",
        stderr: "null",
      })
      this.env.signal.addEventListener("abort", () => {
        process.kill("SIGKILL")
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

type DevRuntimeName = $.Native<typeof $devRuntimeName>
const $devRuntimeName = $.stringUnion([
  "polkadot",
  "kusama",
  "westend",
  "rococo",
])
