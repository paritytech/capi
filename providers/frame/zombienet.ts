import * as path from "../../deps/std/path.ts"
import { Network } from "../../deps/zombienet/orchestrator.ts"
import { Env, PathInfo } from "../../server/mod.ts"
import { PermanentMemo } from "../../util/mod.ts"
import { FrameBinProvider } from "./FrameBinProvider.ts"

export interface ZombienetProviderProps {
  zombienetPath?: string
}

export class ZombienetProvider extends FrameBinProvider<ZombienetLaunchInfo> {
  constructor(env: Env, { zombienetPath }: ZombienetProviderProps = {}) {
    super(env, {
      bin: zombienetPath ?? ZOMBIENET_BIN_DEFAULTS[Deno.build.os]!,
      installation: "https://github.com/paritytech/zombienet",
      readyTimeout: 60 * 1000,
    })
  }

  dynamicUrlKey(pathInfo: PathInfo): string {
    return pathInfo.target!
  }

  parseLaunchInfo(pathInfo: PathInfo) {
    const target = pathInfo.target!
    const i = target.lastIndexOf("/")
    return {
      configPath: target.slice(0, i),
      nodeName: target.slice(i + 1),
    }
  }

  launchMemo = new PermanentMemo<string, Network>()
  async launch(launchInfo: ZombienetLaunchInfo) {
    const network = await this.launchMemo.run(launchInfo.configPath, async () => {
      const zombiecache = await Deno.realPath(await Deno.makeTempDir({ prefix: `capi_zombienet_` }))
      const networkManifestPath = path.join(zombiecache, "zombie.json")
      const network = this.network(zombiecache, networkManifestPath)
      const args: string[] = [
        "-p",
        "native",
        "-d",
        zombiecache,
        "-f",
        "spawn",
        launchInfo.configPath,
      ]
      await this.initBinRun(args)
      return await network
    })
    const node = network.nodesByName[launchInfo.nodeName]
    if (!node) throw new Error()
    return +new URL(node.wsUri).port
  }

  async network(zombienetCachePath: string, networkManifestPath: string): Promise<Network> {
    // TODO: why do even first attempts to close error out with bad resource id?
    const watcher = Deno.watchFs(zombienetCachePath)
    for await (const e of watcher) {
      if (e.kind === "modify" && e.paths.includes(networkManifestPath)) {
        return JSON.parse(await Deno.readTextFile(networkManifestPath))
      }
    }
    return null!
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
