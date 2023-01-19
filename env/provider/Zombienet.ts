import { File } from "../../codegen/mod.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { PathInfo } from "../PathInfo.ts"
import { FrameProviderBase, FrameTargetBase } from "./FrameBase.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
}

export class ZombienetProvider extends FrameProviderBase {
  zombienetPath
  additional
  bin
  zombienets: Record<string, Promise<Network>> = {}

  constructor({ zombienetPath, additional }: ZombienetProviderProps = {}) {
    super()
    this.zombienetPath = zombienetPath
    this.additional = additional
    this.bin = zombienetPath
      ?? `zombienet-${
        ({
          darwin: "macos",
          linux: "linux",
        } as Record<string, string>)[Deno.build.os]
      }`
      ?? (() => {
        throw new Error()
      })()
  }

  target(pathInfo: PathInfo) {
    return new ZombienetTarget(this, pathInfo)
  }

  zombienet(configPath: string): Promise<Network> {
    let net = this.zombienets[configPath]
    if (!net) {
      net = (async () => {
        const tmpDir = await Deno.makeTempDir({ prefix: `capi_zombienet_` })
        const cmd: string[] = [this.bin, "-p", "native", "-d", tmpDir, "-f", "spawn", configPath]
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
            await Deno.remove(tmpDir, { recursive: true })
          })
          // Deno.watchFs on `${networkFilesPath}/zombie.json` could be an alternative
          const buffer = new Uint8Array(1024)
          while (true) {
            await process.stdout.read(buffer)
            const text = new TextDecoder().decode(buffer)
            if (text.includes("Network launched")) {
              process.stdout.close()
              return JSON.parse(await Deno.readTextFile(`${tmpDir}/zombie.json`)) as Network
            }
          }
        } catch (_e) {
          throw new Error( // TODO: auto installation prompt?
            "The Zombienet CLI was not found. Please ensure Zombienet is installed and PATH is set for `zombienet`."
              + ` For more information, visit the following link: "https://github.com/paritytech/zombienet".`,
          )
        }
      })()
      this.zombienets[configPath] = net
    }
    return net
  }
}

export class ZombienetTarget extends FrameTargetBase<ZombienetProvider> {
  configPath
  nodeName
  networkPending
  urlPending
  junctions

  constructor(provider: ZombienetProvider, pathInfo: PathInfo) {
    super(provider, pathInfo)
    const { target } = pathInfo
    const eL = target.lastIndexOf("/")
    this.configPath = target.slice(0, eL)
    const nodeName = target.slice(eL + 1)
    this.nodeName = nodeName
    const networkPending = this.provider.zombienet(this.configPath)
    this.networkPending = networkPending
    this.junctions = this.configPath.split("/")
    this.urlPending = (async () => {
      const config = await networkPending
      const node = config.nodesByName[nodeName]
      if (!node) {
        throw new Error(
          `No such node named "${nodeName}" in zombienet. Available names are "${
            Object.keys(config.nodesByName).join(",")
          }".`,
        )
      }
      return node.wsUri
    })()
  }

  async client() {
    return new Client(proxyProvider, await this.urlPending)
  }

  async clientFile() {
    const clientFile = new File()
    clientFile.codeRaw = `
      import * as C from "../capi.ts"

      export const client = C.rpcClient(C.rpc.proxyProvider, "${await this.urlPending}")
    `
    return clientFile
  }

  async rawClientFile() {
    const file = new File()
    file.codeRaw = `
      import * as C from "../capi.ts"

      export const client = new C.rpc.Client(C.rpc.proxyProvider, "${await this.urlPending}")
    `
    return file
  }
}
