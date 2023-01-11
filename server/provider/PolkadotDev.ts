import { CodegenCtx, Ext, File } from "../../codegen/Ctx.ts"
import { outdent } from "../../deps/outdent.ts"
import { extname } from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import * as port from "../../util/port.ts"
import { FrameProvider, FrameSubpathInfo } from "./common/mod.ts"

export interface PolkadotDevSubpathInfo extends FrameSubpathInfo {
  runtimeName: DevRuntimeName
}

export interface PolkadotDevProviderProps {
  polkadotPath?: string
  additional?: string[]
}

export class PolkadotDevProvider extends FrameProvider {
  devNets: Partial<Record<DevRuntimeName, number>> = {}

  constructor(readonly props?: PolkadotDevProviderProps) {
    super()
  }

  parseSubpathInfo = parsePolkadotDevPathInfo

  async client(info: PolkadotDevSubpathInfo) {
    const port_ = this.devNet(info)
    await port.isReady(port_)
    return new Client(proxyProvider, this.url(info))
  }

  clientFile(info: PolkadotDevSubpathInfo) {
    const file = new File()
    file.code = outdent`
      import * as C from "./capi.ts"

      export const client = C.rpcClient(C.rpc.proxyProvider, "${this.url(info)}")
    `
    return file
  }

  override postInitCodegenCtx(codegenCtx: CodegenCtx, info: PolkadotDevSubpathInfo) {
    const file = new File()
    file.code = outdent`
      import * as C from "./capi.ts"

      export const client = new C.rpc.Client(C.rpc.proxyProvider, "${this.url(info)}")
    `
    codegenCtx.files.set("_/client/raw.ts", file)
  }

  url(info: PolkadotDevSubpathInfo) {
    const port_ = this.devNet(info)
    return `ws://localhost:${port_}`
  }

  devNet({ runtimeName }: PolkadotDevSubpathInfo) {
    let port_ = this.devNets[runtimeName]
    if (!port_) {
      port_ = port.getAvailable()
      const polkadotPath_ = this.props?.polkadotPath ?? "polkadot"
      const cmd: string[] = [
        polkadotPath_ ?? "polkadot",
        "--dev",
        "--ws-port",
        port_.toString(),
        ...this.props?.additional ?? [],
      ]
      if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
      if (this.props?.additional) cmd.push(...this.props.additional)
      try {
        const process = Deno.run({
          cmd,
          stdout: "piped",
          stderr: "piped",
        })
        this.ctx.signal.addEventListener("abort", async () => {
          process.kill("SIGINT")
          await process.status()
          process.close()
        })
        this.devNets[runtimeName] = port_
      } catch (_e) {
        console.log(POLKADOT_PATH_NOT_FOUND)
        Deno.exit(1)
      }
    }
    return port_
  }
}

// TODO: auto installation prompt?
const POLKADOT_PATH_NOT_FOUND =
  "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
  + ` For more information, visit the following link: "https://github.com/paritytech/polkadot".`

export function parsePolkadotDevPathInfo(subpath: string): PolkadotDevSubpathInfo {
  const atI = subpath.indexOf("@")
  if (atI === -1) throw new Error(`Could not find "@" char in path`)
  const runtimeName = subpath.slice(0, atI)
  if (!isDevRuntimeName(runtimeName)) {
    throw new Error(
      `"${runtimeName}" is not a valid dev runtime name. Please specify one of the following: "${
        DEV_RUNTIME_NAMES.join(`", "`)
      }"`,
    )
  }
  const atTrailing = subpath.slice(atI + 1)
  const slashI0 = atTrailing.indexOf("/")
  if (slashI0 === -1) throw new Error("Could not extract chain path")
  const version = atTrailing.slice(0, slashI0)
  const chainKey = subpath.slice(0, atI + 1 + slashI0)
  const filePath = atTrailing.slice(slashI0 + 1)
  const ext = extname(filePath) as Ext
  return { chainKey, runtimeName, version, filePath, ext }
}

export const DEV_RUNTIME_NAMES = ["polkadot", "kusama", "westend", "rococo"] as const
export type DevRuntimeName = typeof DEV_RUNTIME_NAMES[number]

export function isDevRuntimeName(inQuestion: string): inQuestion is DevRuntimeName {
  return !!(DEV_RUNTIME_NAME_EXISTS as Record<string, true>)[inQuestion]
}
const DEV_RUNTIME_NAME_EXISTS: Record<DevRuntimeName, true> = {
  polkadot: true,
  kusama: true,
  westend: true,
  rococo: true,
}
