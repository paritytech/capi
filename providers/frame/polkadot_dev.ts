import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { getAvailable } from "../../util/port.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"
import { createCustomChainSpec } from "./utils/mod.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
}

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
    const chainSpec = await createCustomChainSpec({
      binary: this.bin,
      chain: `${runtimeName}-dev`,
      testUserAccountProps: {
        networkPrefix: DEV_RUNTIME_PREFIXES[runtimeName],
      },
    })
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(args)
    return port
  }
}

const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])
