import { readLines } from "../../deps/std/io.ts"
import { readerFromStreamReader } from "../../deps/std/streams.ts"
import { unreachable } from "../../deps/std/testing/asserts.ts"
import { Network, readNetworkConfig } from "../../deps/zombienet.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
}

export class ZombienetProvider extends FrameBinProvider {
  constructor(env: Env, { zombienetPath }: ZombienetProviderProps = {}) {
    super(env, {
      bin: zombienetPath ?? ZOMBIENET_BIN_DEFAULTS[Deno.build.os]!,
      installation: "https://github.com/paritytech/zombienet",
      readyTimeout: 3 * 60 * 1000,
    })
  }

  launchMemo = new PermanentMemo<string, Network>()
  async launch(pathInfo: PathInfo) {
    const target = pathInfo.target!
    const i = target.lastIndexOf("/")
    const configPath = target.slice(0, i)
    const network = await this.launchMemo.run(configPath, async () => {
      const zombiecache = await Deno.realPath(await Deno.makeTempDir({ prefix: `capi_zombienet_` }))
      const config = readNetworkConfig(configPath)
      ;(config.settings ??= { provider: "native", timeout: 1200 }).provider = "native"
      const options = {
        monitor: false,
        spawnConcurrency: 1,
        dir: zombiecache,
        force: true,
        inCI: false,
      }
      const child = new Deno.Command(Deno.execPath(), {
        args: [
          "run",
          "-A",
          import.meta.resolve("./zombienet_worker.ts"),
          JSON.stringify([config, options]),
        ],
        stdout: "piped",
        stderr: "piped",
      }).spawn()
      this.env.signal.addEventListener("abort", () => {
        child.kill("SIGINT")
      })
      for await (const line of readLines(readerFromStreamReader(child.stdout.getReader()))) {
        if (!line.startsWith("capi_network = ")) continue
        const network = JSON.parse(line.slice("capi_network = ".length)) as Network
        return network
      }
      unreachable()
    })
    const nodeName = target.slice(i + 1)
    const node = network.nodesByName[nodeName]
    if (!node) throw new Error()
    return +new URL(node.wsUri).port
  }

  async network(zombienetCachePath: string, networkManifestPath: string): Promise<Network> {
    const watcher = Deno.watchFs(zombienetCachePath)
    for await (const e of watcher) {
      if (e.kind === "modify" && e.paths.includes(networkManifestPath)) {
        return JSON.parse(await Deno.readTextFile(networkManifestPath))
      }
    }
    return unreachable()
  }
}

const ZOMBIENET_BIN_DEFAULTS: Record<string, string> = {
  darwin: "zombienet-macos",
  linux: "zombienet-linux-x64",
}

interface ZombienetLaunchInfo {
  configPath: string
  nodeName: string
}
