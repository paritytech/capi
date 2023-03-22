import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
import { getOrInit } from "../../util/state.ts"
import { connectionCodeWithUsers, createCustomChainSpec, handleCount } from "./common.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export class PolkadotDevProvider extends FrameBinProvider {
  userCount = new Map<DevRuntimeName, { count: number }>()

  constructor(env: Env) {
    super(env, "polkadot")
  }

  override async connectionCode(pathInfo: PathInfo, isTypes: boolean): Promise<string> {
    const url = new URL(fromPathInfo({ ...pathInfo, filePath: "user_i" }), this.env.href).toString()
    return connectionCodeWithUsers(await super.connectionCode(pathInfo, isTypes), isTypes, url)
  }

  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (pathInfo.filePath === "user_i") {
      $.assert($devRuntimeName, pathInfo.target)
      return handleCount(request, getOrInit(this.userCount, pathInfo.target, () => ({ count: 0 })))
    }
    return super.handle(request, pathInfo)
  }

  async launch(pathInfo: PathInfo) {
    const runtimeName = pathInfo.target
    $.assert($devRuntimeName, runtimeName)
    const port = getAvailable()
    const chainSpec = await createCustomChainSpec(
      this.bin,
      `${runtimeName}-dev`,
      DEV_RUNTIME_PREFIXES[runtimeName],
      this.env.signal,
    )
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(pathInfo, args)
    return port
  }

  override async chainName(pathInfo: PathInfo): Promise<string> {
    return pathInfo.target!.replace(/^./, (x) => x.toUpperCase()) + "Dev"
  }
}

type DevRuntimeName = $.Native<typeof $devRuntimeName>
const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])

const DEV_RUNTIME_PREFIXES: Record<DevRuntimeName, number> = {
  polkadot: 0,
  kusama: 2,
  westend: 42,
  rococo: 42,
}
