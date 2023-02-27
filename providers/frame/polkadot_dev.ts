import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
}

export class PolkadotDevProvider extends FrameBinProvider {
  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps = {}) {
    super(env, {
      bin: polkadotPath ?? "polkadot",
      installation: "https://github.com/paritytech/polkadot",
      readyTimeout: 15 * 1000,
    })
  }

  dynamicUrlKey(pathInfo: PathInfo) {
    const { target } = pathInfo
    $.assert($devRuntimeName, target)
    return target
  }

  async launch(pathInfo: PathInfo) {
    const runtimeName = this.dynamicUrlKey(pathInfo)
    const port = getAvailable()
    const args: string[] = ["--dev", "--ws-port", port.toString()]
    if (runtimeName !== "polkadot") args.push(`--force-${runtimeName}`)
    await this.initBinRun(args)
    return port
  }
}

type DevRuntimeName = $.Native<typeof $devRuntimeName>
const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])
