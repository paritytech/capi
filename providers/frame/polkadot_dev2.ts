import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { getAvailable, ready } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export interface PolkadotDevProviderProps2 {
  polkadotPath?: string
}

export class PolkadotDevProvider2 extends FrameBinProvider<DevRuntimeName> {
  providerId = "dev2"

  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps2 = {}) {
    super(env, {
      bin: polkadotPath ?? "polkadot",
      installation: "https://github.com/paritytech/polkadot",
    })
  }

  launchArg(pathInfo: PathInfo) {
    const { target } = pathInfo
    $.assert($devRuntimeName, target)
    return target
  }

  processKey = this.launchArg

  args(runtimeName: DevRuntimeName) {
    const port = getAvailable()
    const args: string[] = ["--dev", "--ws-port", port.toString()]
    if (runtimeName !== "polkadot") args.push(`--force-${runtimeName}`)
    return args
  }

  async spawnDevNet(runtimeName: DevRuntimeName) {
    const port = getAvailable()
    const cmd: string[] = [this.bin, "--dev", "--ws-port", port.toString()]
    if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
    try {
      const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
      })
      this.env.signal.addEventListener("abort", () => {
        process.kill()
        process.close()
      })
    } catch (_e) {
      throw new Error() // TODO: auto installation prompt?
    }
    await ready(port)
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
