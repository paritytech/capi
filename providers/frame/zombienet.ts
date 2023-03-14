import { readLines } from "../../deps/std/io.ts"
import { readerFromStreamReader } from "../../deps/std/streams.ts"
import { unreachable } from "../../deps/std/testing/asserts.ts"
import { Network, readNetworkConfig } from "../../deps/zombienet.ts"
import { PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { FrameProxyProvider } from "./FrameProxyProvider.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
}

export class ZombienetProvider extends FrameProxyProvider {
  networkMemo = new PermanentMemo<string, Record<string, string>>()
  async dynamicUrl(pathInfo: PathInfo) {
    const target = pathInfo.target!
    const i = target.lastIndexOf("/")
    const configPath = target.slice(0, i)
    const network = await this.networkMemo.run(configPath, async () => {
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
        const network = JSON.parse(line.slice("capi_network = ".length)) as Record<string, string>
        return network
      }
      unreachable()
    })
    const nodeName = target.slice(i + 1)
    const url = network[nodeName]
    if (!url) throw new Error()
    return url
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
