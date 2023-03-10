import { File } from "../../codegen/frame/mod.ts"
import * as $ from "../../deps/scale.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { fromPathInfo } from "../../server/PathInfo.ts"
import { getAvailable } from "../../util/port.ts"
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
  // FIXME: narrow key
  userCount: Record<string, number | undefined> = {}

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
    const file = await super.chainFile(pathInfo)
    return new File(`
      ${file.codeRaw}

      type ArrayOfLength<
        T,
        L extends number,
        A extends T[] = [],
      > = number extends L ? T[]
        : L extends A["length"] ? A
        : ArrayOfLength<T, L, [...A, T]>

      export async function users<N extends number>(count: N): Promise<ArrayOfLength<C.Sr25519, N>>
      export async function users(count: number): Promise<C.Sr25519[]> {
        const response = await fetch(
          ${JSON.stringify(url)},
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ count }),
          },
        )
        if (!response.ok) {
          throw new Error(await response.text())
        }
        const { index }: { index: number } = await response.json()
        if (index === -1) {
          throw new Error("Maximum test user count reached")
        }
        const userIds: C.Sr25519[] = []
        for (let i = index; i < index + count; i++) {
          userIds.push(C.testUser(i))
        }
        return userIds
      }
    `)
  }

  override async handle(request: Request, pathInfo: PathInfo): Promise<Response> {
    if (pathInfo.filePath === "user_i") {
      const body = await request.json()
      $.assert($.field("count", $.u32), body)
      const { count } = body
      $.assert($devRuntimeName, pathInfo.target)
      let index = this.userCount[pathInfo.target] ?? 0
      const newCount = index + count
      if (newCount < PolkadotDevProvider.DEFAULT_TEST_USER_COUNT) {
        this.userCount[pathInfo.target!] = newCount
      } else {
        index = -1
      }
      return new Response(
        JSON.stringify({ index }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      )
    }
    return super.handle(request, pathInfo)
  }

  async launch(pathInfo: PathInfo) {
    const runtimeName = pathInfo.target
    $.assert($devRuntimeName, runtimeName)
    const port = getAvailable()
    const chainSpec = await this.createCustomChainSpec(
      `${runtimeName}-dev`,
      DEV_RUNTIME_PREFIXES[runtimeName],
    )
    const args: string[] = ["--tmp", "--alice", "--ws-port", port.toString(), "--chain", chainSpec]
    await this.runBin(args)
    return port
  }
}

const $devRuntimeName = $.literalUnion(["polkadot", "kusama", "westend", "rococo"])
