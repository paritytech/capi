import { deadline } from "../../deps/std/async.ts"
import * as path from "../../deps/std/path.ts"
import { copy } from "../../deps/std/streams.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo, splitLast } from "../../util/mod.ts"
import { isReady } from "../../util/port.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
  additional?: string[]
  timeout?: number
}

const defaultZombienetPaths: Record<string, string | undefined> = {
  darwin: "zombienet-macos",
  linux: "zombienet-linux",
}

export class ZombienetProvider extends FrameProxyProvider {
  providerId = "zombienet"
  zombienetPath
  additional
  timeout

  constructor(env: Env, { zombienetPath, additional, timeout }: ZombienetProviderProps = {}) {
    super(env)
    zombienetPath ??= defaultZombienetPaths[Deno.build.os]
    if (!zombienetPath) {
      throw new Error(
        "Failed to determine zombienet path. Please specify in provider via `zombienetPath` prop.",
      )
    }
    this.zombienetPath = zombienetPath
    this.additional = additional ?? []
    this.timeout = timeout ?? 5 * 60 * 1000
  }

  urlMemo = new PermanentMemo<string, string>()
  dynamicUrl(pathInfo: PathInfo) {
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
            Object.keys(network.nodesByName).join(`", "`)
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
      const watcher = Deno.watchFs(tmpDir)
      const closeWatcher = () => {
        if (typeof Deno.resources()[watcher.rid] === "number") watcher.close()
      }
      const networkManifestPath = path.join(tmpDir, "zombie.json")
      const configPending = deadline(
        (async () => {
          for await (const e of watcher) {
            if (e.kind === "create" && e.paths.some((path) => path.endsWith(networkManifestPath))) {
              closeWatcher()
              return JSON.parse(await Deno.readTextFile(networkManifestPath)) as Network
            }
          }
          return
        })(),
        this.timeout,
      ).finally(closeWatcher)
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
        stderr: "piped",
      })
      const closeProcess = () => {
        if (typeof Deno.resources()[process.rid] === "number") {
          process.kill("SIGINT")
          process.close()
        }
      }
      this.env.signal.addEventListener("abort", async () => {
        closeWatcher()
        closeProcess()
        await Deno.remove(tmpDir, { recursive: true })
      })
      const maybeConfig = await Promise.race([
        configPending,
        process.status().then(() => undefined),
      ])
      if (maybeConfig) return maybeConfig
      await copy(process.stderr, Deno.stderr)
      throw new Error("Zombienet exited without launching network")
    })
  }
}
