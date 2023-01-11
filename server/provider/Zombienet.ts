import { Ext, File } from "../../codegen/mod.ts"
import { Network } from "../../deps/@zombienet/orchestrator.ts"
import { outdent } from "../../deps/outdent.ts"
import * as path from "../../deps/std/path.ts"
import { Client, proxyProvider } from "../../rpc/mod.ts"
import { FrameProvider, FrameSubpathInfo } from "./common/mod.ts"

export interface ZombienetSubpathInfo extends FrameSubpathInfo {
  configPath: string
  nodeName: string
}

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
}

export class ZombienetProvider extends FrameProvider {
  bin
  zombienets: Record<string, Network> = {}

  constructor(readonly props?: ZombienetProviderProps) {
    super()
    this.bin = props?.zombienetPath
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

  parseSubpathInfo = parseZombienetSubpathInfo

  async client(info: ZombienetSubpathInfo) {
    return new Client(proxyProvider, await this.url(info))
  }

  async clientFile(info: ZombienetSubpathInfo) {
    const clientFile = new File()
    clientFile.code = outdent`
      import * as C from "../capi.ts"

      export const client = new C.rpcClient(C.rpc.proxyProvider, "${await this.url(info)}")
    `
    return clientFile
  }

  async url(info: ZombienetSubpathInfo) {
    const config = await this.zombienet(info)
    const node = config.nodesByName[info.nodeName]
    if (!node) throw new Error()
    return node.wsUri
  }

  // TODO: check dependencies and provide friendly messages
  async zombienet({ configPath }: ZombienetSubpathInfo) {
    let net = this.zombienets[configPath]
    if (!net) {
      console.log(`Initializing zombienet with "${path.join(Deno.cwd(), configPath)}"`)
      const tmpDir = Deno.makeTempDirSync({ prefix: `capi_zombienet_` })
      const cmd: string[] = [this.bin, "-p", "native", "-d", tmpDir, "-f", "spawn", configPath]
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
        console.log(ZOMBIENET_PATH_NOT_FOUND)
        Deno.exit(1)
      }
    }
    return net
  }
}

export function parseZombienetSubpathInfo(subpath: string): ZombienetSubpathInfo {
  const atI = subpath.indexOf("@")
  if (atI === -1) throw new Error(`Expected "@" character to appear in URL`)
  const leading = subpath.slice(0, atI)
  const slashI0 = leading.lastIndexOf("/")
  if (slashI0 === -1) throw new Error(`Expected "/" character to appear in URL`)
  const configPath = leading.slice(0, slashI0)
  const nodeName = leading.slice(slashI0 + 1)
  const trailing = subpath.slice(atI + 1)
  const slashI1 = trailing.indexOf("/")
  if (slashI1 === -1) throw new Error()
  const version = trailing.slice(0, slashI1)
  const filePath = trailing.slice(slashI1 + 1)
  const chainKey = subpath.slice(0, atI + 1 + slashI1)
  const ext = path.extname(filePath) as Ext
  return { nodeName, chainKey, configPath, ext, filePath, version }
}

// TODO: auto installation prompt?
const ZOMBIENET_PATH_NOT_FOUND =
  "The Zombienet CLI was not found. Please ensure Zombienet is installed and PATH is set for `zombienet`."
  + ` For more information, visit the following link: "https://github.com/paritytech/zombienet".`
