import { Client, proxyProvider } from "../../rpc/mod.ts"
import * as port from "../../util/port.ts"
import { PathInfo } from "../PathInfo.ts"
import { FrameProviderBase, FrameTargetBase, getClientFile, getRawClientFile } from "./FrameBase.ts"

export interface PolkadotDevProviderProps {
  polkadotPath?: string
  additional?: string[]
}

export class PolkadotDevProvider extends FrameProviderBase {
  bin
  additional
  ports: Partial<Record<DevRuntimeName, number>> = {}

  constructor({ polkadotPath, additional }: PolkadotDevProviderProps = {}) {
    super()
    this.bin = polkadotPath ?? "polkadot"
    this.additional = additional ?? []
  }

  target(pathInfo: PathInfo) {
    return new PolkadotDevTarget(this, pathInfo)
  }

  ensureDevNet(runtimeName: DevRuntimeName) {
    let port_ = this.ports[runtimeName]
    if (!port_) {
      port_ = port.getAvailable()
      const cmd: string[] = [this.bin, "--dev", "--ws-port", port_.toString(), ...this.additional]
      if (runtimeName !== "polkadot") cmd.push(`--force-${runtimeName}`)
      if (this.additional) cmd.push(...this.additional)
      try {
        const process = Deno.run({
          cmd,
          stdout: "piped",
          stderr: "piped",
        })
        this.env.signal.addEventListener("abort", async () => {
          process.kill("SIGINT")
          await process.status()
          process.close()
        })
        this.ports[runtimeName] = port_
      } catch (_e) {
        throw new Error( // TODO: auto installation prompt?
          "The Polkadot CLI was not found. Please ensure Polkadot is installed and PATH is set for `polkadot`."
            + ` For more information, visit the following link: "https://github.com/paritytech/polkadot".`,
        )
      }
    }
    return port_
  }
}

export class PolkadotDevTarget extends FrameTargetBase<PolkadotDevProvider> {
  port
  url
  ready

  constructor(provider: PolkadotDevProvider, pathInfo: PathInfo) {
    super(provider, pathInfo)
    assertDevRuntimeName(pathInfo.target)
    this.port = this.provider.ensureDevNet(pathInfo.target)
    this.url = `ws://localhost:${this.port}`
    this.ready = port.isReady(this.port)
  }

  async client() {
    await this.ready
    return new Client(proxyProvider, this.url)
  }

  clientFile = getClientFile
  rawClientFile = getRawClientFile
}

export const DEV_RUNTIME_NAMES = ["polkadot", "kusama", "westend", "rococo"] as const
export type DevRuntimeName = typeof DEV_RUNTIME_NAMES[number]

export function assertDevRuntimeName(inQuestion: string): asserts inQuestion is DevRuntimeName {
  if (!(DEV_RUNTIME_NAME_EXISTS as Record<string, true>)[inQuestion]) throw new Error()
}
const DEV_RUNTIME_NAME_EXISTS: Record<DevRuntimeName, true> = {
  polkadot: true,
  kusama: true,
  westend: true,
  rococo: true,
}
