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
  timeout?: number
}

const defaultZombienetPaths: Record<string, string | undefined> = {
  darwin: "zombienet-macos",
  linux: "zombienet-linux-x64",
}

export class ZombienetProvider extends FrameProxyProvider {
  providerId = "zombienet"
  zombienetPath
  timeout

  constructor(env: Env, { zombienetPath, timeout }: ZombienetProviderProps = {}) {
    super(env)
    zombienetPath ??= defaultZombienetPaths[Deno.build.os]
    if (!zombienetPath) {
      throw new Error(
        "Failed to determine zombienet path. Please specify in provider via `zombienetPath` prop.",
      )
    }
    this.zombienetPath = zombienetPath
    this.timeout = timeout ?? 2 * 60 * 1000
  }

  urlMemo = new PermanentMemo<string, string>()
  dynamicUrl(pathInfo: PathInfo) {
    const { target } = pathInfo
    if (!target) throw new Error("Missing target")
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
      const tmpDir = await Deno.realPath(await Deno.makeTempDir({ prefix: `capi_zombienet_` }))
      const watcher = Deno.watchFs(tmpDir)
      let watcherClosed = false
      const closeWatcher = () => {
        if (!watcherClosed) return
        watcherClosed = true
        watcher.close()
      }
      const networkManifestPath = path.join(tmpDir, "zombie.json")
      const configPending = deadline(
        (async () => {
          for await (const e of watcher) {
            if (e.kind === "modify" && e.paths.includes(networkManifestPath)) {
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
      ]
      const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
      })
      let closeProcess = () => {
        closeProcess = () => {}
        process.kill()
        process.close()
        process.stdout.close()
        process.stderr.close()
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
      closeProcess()
      throw new Error("Zombienet exited without launching network")
    })
  }
}
