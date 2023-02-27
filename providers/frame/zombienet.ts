import { Network, readNetworkConfig, start } from "../../deps/zombienet.ts";
import { PathInfo } from "../../server/mod.ts";
import { PermanentMemo } from "../../util/mod.ts";
import { FrameProxyProvider } from "./FrameProxyProvider.ts";

export interface ZombienetProviderProps {
  zombienetPath?: string;
}

export class ZombienetProvider extends FrameProxyProvider {
  networkMemo = new PermanentMemo<string, Network>();
  async dynamicUrl(pathInfo: PathInfo) {
    const target = pathInfo.target!;
    const i = target.lastIndexOf("/");
    const configPath = target.slice(0, i);
    const network = await this.networkMemo.run(configPath, async () => {
      const zombiecache = await Deno.realPath(
        await Deno.makeTempDir({ prefix: `capi_zombienet_` }),
      );
      const config = readNetworkConfig(configPath);
      (config.settings ??= { provider: "native", timeout: 1200 }).provider =
        "native";
      const options = {
        monitor: false,
        spawnConcurrency: 1,
        dir: zombiecache,
        force: true,
        inCI: false,
      };
      const network = await start("", config, options);
      this.env.signal.addEventListener("abort", () => {
        network.stop();
      });
      return network;
    });
    const nodeName = target.slice(i + 1);
    const url = network.nodesByName[nodeName]?.wsUri;
    if (!url) throw new Error();
    return url;
  }
}
