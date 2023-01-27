import { readLines } from "../../deps/std/io.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo, splitLast } from "../../util/mod.ts"
import { isReady } from "../../util/port.ts"
import { FrameProxyProvider } from "./ProxyBase.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
}

const defaultZombienetPaths: Record<string, string | undefined> = {
  darwin: "zombienet-macos",
  linux: "zombienet-linux",
}

export class ZombienetProvider extends FrameProxyProvider {
  providerId = "zombienet"
  zombienetPath
  additional

  constructor(env: Env, { zombienetPath, additional }: ZombienetProviderProps = {}) {
    super(env)
    zombienetPath ??= defaultZombienetPaths[Deno.build.os]
    if (!zombienetPath) {
      throw new Error(
        "Failed to determine zombienet path. Please specify in provider via `zombienetPath` prop.",
      )
    }
    this.zombienetPath = zombienetPath
    this.additional = additional ?? []
  }

  urlMemo = new PermanentMemo<string, string>()
  url(pathInfo: PathInfo) {
    const { target } = pathInfo
    return this.urlMemo.run(target, async () => {
      const targetParts = splitLast("/", target)
      if (!targetParts) throw new Error("Failed to parse zombienet target")
      const [configPath, nodeName] = targetParts
      const network = await this.zombienet(configPath)
      const node = network.nodesByName[nodeName]
      if (!node) {
        throw new Error(
          `No such node named "${nodeName}" in zombienet. Available names are "${
            Object.keys(network.nodesByName).join(",")
          }".`,
        )
      }
      await isReady(+new URL(node.wsUri).port)
      return node.wsUri
    })
  }

  zombienetMemo = new PermanentMemo<string, Network>()
  zombienet(configPath: string): Promise<Network> {
    return this.zombienetMemo.run(configPath, async () => {
      const tmpDir = Deno.makeTempDirSync({ prefix: `capi_zombienet_` })
      const cmd: string[] = [
        this.zombienetPath,
        "-p",
        "native",
        "-d",
        tmpDir,
        "-f",
        "spawn",
        configPath,
        ...this.additional,
      ]
      const process = Deno.run({
        cmd,
        stdout: "piped",
      })
      this.env.signal.addEventListener("abort", async () => {
        process.kill("SIGINT")
        await process.status()
        process.close()
        await Deno.remove(tmpDir, { recursive: true })
      })
      // TODO: utilize Deno.watchFs to observe `${networkFilesPath}/zombie.json`
      for await (const line of readLines(process.stdout)) {
        if (line.includes("Network launched")) {
          process.stdout.close()
          return JSON.parse(await Deno.readTextFile(`${tmpDir}/zombie.json`)) as Network
        }
      }
      throw new Error("Zombienet exited without launching network")
    })
  }
}
