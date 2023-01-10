import { Ext } from "../../codegen/mod.ts"
import * as path from "../../deps/std/path.ts"
import { FramePathInfo, FrameProvider } from "./common/mod.ts"

export interface ZombienetPathInfo extends FramePathInfo {
  configPath: string
  chainId: string
}

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
}

export class ZombienetProvider extends FrameProvider {
  zombienetTmp = Deno.makeTempDirSync({ prefix: "capi_zombienet_" })
  zombienets: Record<string, string> = {}

  constructor(readonly props?: ZombienetProviderProps) {
    super()
  }

  parsePathInfo = parseZombienetPathInfo

  client(pathInfo: ZombienetPathInfo) {}

  clientFile(pathInfo: ZombienetPathInfo) {}

  url(pathInfo: ZombienetPathInfo) {}

  zombienet(pathInfo: ZombienetPathInfo) {
    const cmd: string[] = [
      this.props?.zombienetPath ?? "zombienet",
      "-d",
      this.zombienetTmp,
      "--provider",
      "native",
      "--force",
      "spawn",
      pathInfo.configPath,
    ]
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
        Deno.remove(this.zombienetTmp, { recursive: true })
      })
    } catch (_e) {
      console.log(ZOMBIENET_PATH_NOT_FOUND)
      Deno.exit(1)
    }
  }
}

export function parseZombienetPathInfo(path_: string): ZombienetPathInfo {
  const atI = path_.search("@")
  if (atI == -1) throw new Error(`Expected "@" character to appear in URL`)
  const leading = path_.slice(0, atI)
  const hashI = leading.search("#")
  if (hashI == -1) throw new Error(`Expected "#" character to appear in URL`)
  const configPath = leading.slice(0, hashI)
  const chainId = leading.slice(hashI + 1)
  const trailing = path_.slice(atI + 1)
  const slashI = trailing.search("/")
  if (slashI == -1) throw new Error()
  const version = trailing.slice(0, slashI)
  const filePath = trailing.slice(slashI + 1)
  const chainKey = path_.slice(0, atI + 1 + slashI)
  const ext = path.extname(filePath) as Ext
  return { chainId, chainKey, configPath, ext, filePath, version }
}

// TODO: auto installation prompt?
const ZOMBIENET_PATH_NOT_FOUND =
  "The Zombienet CLI was not found. Please ensure Zombienet is installed and PATH is set for `zombienet`."
  + ` For more information, visit the following link: "https://github.com/paritytech/zombienet".`

// import { client as relayChainClient } from "http://localhost:8000/zombienet/examples/xcm_teleport_assets.toml#alice/_/client.ts"
// import { client as parachainClient } from "http://localhost:8000/zombienet/examples/xcm_teleport_assets.toml#collator01/_/client.ts"

// import * as Z from "../../deps/zones.ts"
// import * as rpc from "../../rpc/mod.ts"

// export {}

// export const start = async (configFile: string, env?: Record<string, string>) => {
//   const networkFilesPath = await Deno.makeTempDir({ prefix: "capi_zombienet_" })
//   const zombienetBinary = (() => {
//     switch (Deno.build.os) {
//       case "darwin":
//         return "zombienet-macos"
//       case "linux":
//         return "zombienet-linux"
//       default:
//         throw new Error(`zombienet does not support ${Deno.build.os} OS`)
//     }
//   })()
//   const process = Deno.run({
//     cmd: [
//       zombienetBinary,
//       "-d",
//       networkFilesPath,
//       "--provider",
//       "native",
//       "--force",
//       "spawn",
//       configFile,
//     ],
//     stdout: "piped",
//     env,
//   })
//   // TODO: improve Network launched detection
//   // Deno.watchFs on `${networkFilesPath}/zombie.json` could be an alternative
//   const buffer = new Uint8Array(1024)
//   while (true) {
//     await process.stdout?.read(buffer)
//     const text = new TextDecoder().decode(buffer)
//     if (text.includes("Network launched")) {
//       process.stdout.close()
//       break
//     }
//   }
//   const close = async () => {
//     process.kill("SIGINT")
//     await process.status()
//     process.close()
//     Deno.remove(networkFilesPath, { recursive: true })
//   }
//   const config = JSON.parse(await Deno.readTextFile(`${networkFilesPath}/zombie.json`))
//   const clients = {
//     relay: config.relay.map((node: any) => new NodeClientEffect(node.wsUri)) as NodeClientEffect[],
//     paras: Object.entries(config.paras)
//       .reduce(
//         (acc, [name, { nodes }]: any) => {
//           acc[name] = nodes.map((node: any) => new NodeClientEffect(node.wsUri))
//           return acc
//         },
//         {} as Record<string, NodeClientEffect[]>,
//       ),
//     byName: Object.entries(config.nodesByName)
//       .reduce(
//         (acc, [name, node]: any) => {
//           acc[name] = new NodeClientEffect(node.wsUri)
//           return acc
//         },
//         {} as Record<string, NodeClientEffect>,
//       ),
//   }
//   return { close, config, clients }
// }
