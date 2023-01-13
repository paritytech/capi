import { File } from "../../codegen/mod.ts"
import { outdent } from "../../deps/outdent.ts"
import * as path from "../../deps/std/path.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { Host } from "../Host.ts"
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
  zombienets: Record<string, Network> = {}

  constructor(host: Host, { zombienetPath, additional }: ZombienetProviderProps = {}) {
    super(host)
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

  async zombienet(configPath: string): Promise<Network> {
    let net = this.zombienets[configPath]
    if (!net) {
      console.log(`Initializing zombienet with "${path.join(Deno.cwd(), configPath)}"`)
      const tmpDir = Deno.makeTempDirSync({ prefix: `capi_zombienet_` })
      const cmd: string[] = [this.bin, "-p", "native", "-d", tmpDir, "-f", "spawn", configPath]
      if (this.additional) cmd.push(...this.additional)
      try {
        const process = Deno.run({
          cmd,
          stdout: "piped",
          stderr: "piped",
        })
        this.host.abortController.signal.addEventListener("abort", async () => {
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
            net = JSON.parse(await Deno.readTextFile(`${tmpDir}/zombie.json`)) as Network
            this.zombienets[configPath] = net
            break
          }
        }
      } catch (_e) {
        throw new Error( // TODO: auto installation prompt?
          "The Zombienet CLI was not found. Please ensure Zombienet is installed and PATH is set for `zombienet`."
            + ` For more information, visit the following link: "https://github.com/paritytech/zombienet".`,
        )
      }
    }
    return net
  }
}

export class ZombienetTarget extends FrameTargetBase<ZombienetProvider> {
  configPath
  nodeName
  networkPending
  urlPending

  constructor(provider: ZombienetProvider, pathInfo: PathInfo) {
    super(provider, pathInfo)
    const { target } = pathInfo
    const eL = target.lastIndexOf("/")
    this.configPath = target.slice(0, eL)
    const nodeName = target.slice(eL + 1)
    this.nodeName = nodeName
    const networkPending = this.provider.zombienet(this.configPath)
    this.networkPending = networkPending
    this.urlPending = (async () => {
      const config = await networkPending
      const node = config.nodesByName[nodeName]
      if (!node) throw new Error()
      return node.wsUri
    })()
  }

  async client() {
    return new Client(proxyProvider, await this.urlPending)
  }

  async clientFile() {
    const clientFile = new File()
    clientFile.code = outdent`
      import * as C from "../capi.ts"

      export const client = new C.rpcClient(C.rpc.proxyProvider, "${await this.urlPending}")
    `
    return clientFile
  }

  async rawClientFile() {
    const file = new File()
    file.code = outdent`
      import * as C from "../capi.ts"

      export const client = new C.rpc.Client(C.rpc.proxyProvider, "${await this.urlPending}")
    `
    return file
  }
}
