import { delay } from "../../deps/std/async.ts"
import * as path from "../../deps/std/path.ts"
import { unreachable } from "../../deps/std/testing/asserts.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
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
      const networkManifestPath = path.join(zombiecache, "zombie.json")
      const network = this.network(zombiecache, networkManifestPath)
      const args: string[] = ["-p", "native", "-d", zombiecache, "-f", "spawn", configPath]
      await this.runBin(args)
      return await network
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
        // the `modify` is triggered while the networkManifestPath is writtent
        await delay(1000)
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
