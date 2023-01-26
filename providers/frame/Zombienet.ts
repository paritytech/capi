import { File } from "../../codegen/mod.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import * as U from "../../util/mod.ts"
import { FrameProvider } from "./Base.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
}

export class ZombienetProvider extends FrameProvider {
  providerId = "zombienet"
  zombienetPath
  additional
  bin
  zombienets: Record<string, Promise<Network>> = {}
  urlPendings: Record<string, Promise<string>> = {}
  clients: Record<string, Promise<Client>> = {}

  constructor(env: Env, { zombienetPath, additional }: ZombienetProviderProps = {}) {
    super(env)
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

  cacheKey({ target }: PathInfo) {
    return target
  }

  url(pathInfo: PathInfo) {
    const { target } = pathInfo
    let urlPending = this.urlPendings[target]
    if (!urlPending) {
      const lI = target.lastIndexOf("/")
      if (lI === -1) throw new Error("Failed to parse zombienet target")
      const configPath = target.slice(0, lI)
      urlPending = (async () => {
        const network = await this.zombienet(configPath)
        const nodeName = target.slice(lI + 1)
        const node = network.nodesByName[nodeName]
        if (!node) {
          throw new Error(
            `No such node named "${nodeName}" in zombienet. Available names are "${
              Object.keys(network.nodesByName).join(",")
            }".`,
          )
        }
        return node.wsUri
      })()
      this.urlPendings[target] = urlPending
    }
    return urlPending
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
            closed = true
            process.kill("SIGINT")
            await process.status()
            process.close()
            await Deno.remove(tmpDir, { recursive: true })
          })
          // TODO: utilize Deno.watchFs to observe `${networkFilesPath}/zombie.json`
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

  client(pathInfo: PathInfo) {
    const { src } = pathInfo
    let client = this.clients[src]
    if (!client) {
      client = (async () => {
        const client = new Client(proxyProvider, await this.url(pathInfo))
        this.env.signal.addEventListener("abort", client.discard)
        return client
      })()
      this.clients[src] = client
    }
    return client
  }

  async clientFile(pathInfo: PathInfo) {
    const url = await this.url(pathInfo)
    return new File(`
      import * as C from "../capi.ts"

      export const client = C.rpcClient(C.rpc.proxyProvider, "${url}")
    `)
  }

  async rawClientFile(pathInfo: PathInfo) {
    const url = await this.url(pathInfo)
    return new File(`
      import * as C from "../capi.ts"

      export const client = new C.rpc.Client(C.rpc.proxyProvider, "${url}")
    `)
  }
}
