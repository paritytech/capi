import { Ext, File } from "../../codegen/Ctx.ts"
import { extname } from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import * as port from "../../util/port.ts"
import { FrameProvider, FrameProviderPathInfo } from "./common/mod.ts"

export type PolkadotDevProviderPathInfo = FrameProviderPathInfo<DevRuntimeName>

export interface PolkadotDevProviderProps {
  polkadotPath?: string
  additional?: string[]
}

export class PolkadotDevProvider extends FrameProvider<DevRuntimeName> {
  #devNets: Partial<Record<DevRuntimeName, number>> = {}

  constructor(readonly props: PolkadotDevProviderProps = {}) {
    super()
  }

  parsePathInfo = parsePolkadotDevPathInfo

  async client(pathInfo: PolkadotDevProviderPathInfo) {
    const port_ = this.devNet(pathInfo)
    await port.isReady(port_)
    return new Client(proxyProvider, this.url(pathInfo))
  }

  clientFile(pathInfo: PolkadotDevProviderPathInfo) {
    const file = new File()
    file.code = `
import * as C from "./capi.ts"

export const client = C.rpcClient(C.rpc.proxyProvider, "${this.url(pathInfo)}")
`
    return file
  }

  url(pathInfo: PolkadotDevProviderPathInfo) {
    const port_ = this.devNet(pathInfo)
    return `ws://localhost:${port_}`
  }

  devNet({ discoveryValue }: PolkadotDevProviderPathInfo) {
    let port_ = this.#devNets[discoveryValue]
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
      if (discoveryValue !== "polkadot") cmd.push(`--force-${discoveryValue}`)
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
        this.#devNets[discoveryValue] = port_
      } catch (_e) {
        console.log(POLKADOT_PATH_NOT_FOUND)
        Deno.exit(1)
      }
    }
    return port_
  }
}

const POLKADOT_PATH_NOT_FOUND =
  "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
  + `For more information, visit the following link: "https://github.com/paritytech/polkadot".`

export function parsePolkadotDevPathInfo(path: string): PolkadotDevProviderPathInfo {
  const atI = path.search("@")
  if (atI == -1) throw new Error(`Could not find "@" char in path`)
  const discoveryValue = path.slice(0, atI)
  if (!isDevRuntimeName(discoveryValue)) {
    throw new Error(
      `"${discoveryValue}" is not a valid dev runtime name. Please specify one of the following: "${
        DEV_RUNTIME_NAMES.join(`", "`)
      }"`,
    )
  }
  const atTrailing = path.slice(atI + 1)
  const slashI0 = atTrailing.search("/")
  if (slashI0 == -1) throw new Error("Could not extract chain path")
  const version = atTrailing.slice(0, slashI0)
  const key = path.slice(0, atI + 1 + slashI0)
  const filePath = atTrailing.slice(slashI0 + 1)
  const ext = extname(filePath) as Ext
  return { key, discoveryValue, version, filePath, ext }
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
