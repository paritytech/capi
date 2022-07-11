import { unimplemented } from "../../_deps/asserts.ts";
import { Config } from "../../Config.ts";
import { AnyMethods, isWsUrl } from "../../util/mod.ts";
import { ProxyClient, proxyClient } from "./proxy.ts";
import { SmoldotClient, smoldotClient } from "./smoldot.ts";

export type StdClient<M extends AnyMethods> = ProxyClient<M> | SmoldotClient<M>;

// TODO: get rid of / supply as `V` in effect run
export function detectClient<M extends AnyMethods>(config: Config<string, M>) {
  if (typeof config.discoveryValue === "string") {
    if (isWsUrl(config.discoveryValue)) {
      return proxyClient<M>(config);
    } else {
      return smoldotClient<M>(config);
    }
  }
  unimplemented();
}
