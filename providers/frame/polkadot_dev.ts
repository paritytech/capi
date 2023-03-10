import { File } from "../../codegen/frame/mod.ts"
import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
import { getOrInit } from "../../util/state.ts"
import { chainFileWithUsers, createCustomChainSpec, handleCount } from "./common.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

const DEV_RUNTIME_PREFIXES = {
  polkadot: 0,
  kusama: 2,
  westend: 42,
  rococo: 42,
} as const

export interface PolkadotDevProviderProps {
  polkadotPath?: string
}

export class PolkadotDevProvider extends FrameBinProvider {
  userCount = new Map<DevRuntimeName, { count: number }>()

  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps = {}) {
    super(env, {
      bin: polkadotPath ?? "polkadot",
      installation: "https://github.com/paritytech/polkadot",
      readyTimeout: 60 * 1000,
    })
  }

  override async chainFile(pathInfo: PathInfo): Promise<File> {
    const url = new URL(fromPathInfo({ ...pathInfo, filePath: "user_i" }), this.env.href)
      .toString()
    return chainFileWithUsers(await super.chainFile(pathInfo), url)
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
    )
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(args)
    return port
  }
}

const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])

type DevRuntimeName = $.Native<typeof $devRuntimeName>
