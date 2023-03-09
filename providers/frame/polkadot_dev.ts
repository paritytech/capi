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

const TEST_USER_COUNT = 10

export class PolkadotDevProvider extends FrameBinProvider {
  #testUserCountCache: Record<string, number> = {}

  constructor(env: Env, { polkadotPath }: PolkadotDevProviderProps = {}) {
    super(env, {
      bin: polkadotPath ?? "polkadot",
      installation: "https://github.com/paritytech/polkadot",
      readyTimeout: 60 * 1000,
    })
  }

  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (request.method.toUpperCase() === "POST" && pathInfo.filePath === "test-users") {
      console.log("polakdot_dev.handle", { request, pathInfo })

      try {
        const { count } = await request.json()
        const currentCount = this.#testUserCountCache[this.#getRuntime(pathInfo)] ?? 0
        if (count + currentCount > TEST_USER_COUNT) {
          throw new Error("Maximum test user count reached")
        }
        const from = currentCount
        const to = currentCount + count
        this.#testUserCountCache[this.#getRuntime(pathInfo)] = to

        return new Response(
          JSON.stringify({ from, to }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        )
      } catch (error) {
        console.log("Error", request.url, error)
        const message = error instanceof Error
          ? error.message
          : "Unknown error"
        return new Response(message, { status: 400 })
      }
    }
    return super.handle(request, pathInfo)
  }

  async launch(pathInfo: PathInfo) {
    const runtimeName = this.#getRuntime(pathInfo)
    $.assert($devRuntimeName, runtimeName)
    const port = getAvailable()
    const chainSpec = await createCustomChainSpec({
      binary: this.bin,
      chain: `${runtimeName}-dev`,
      testUserAccountProps: {
        networkPrefix: DEV_RUNTIME_PREFIXES[runtimeName],
        count: TEST_USER_COUNT,
      },
    })
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(args)
    return port
  }

  #getRuntime(pathInfo: PathInfo) {
    return pathInfo.target || "polkadot"
  }
}

const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])
