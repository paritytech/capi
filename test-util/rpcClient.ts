import { KnownRpcMethods } from "../known/mod.ts";
import { LocalBeacon, localClient } from "../rpc/mod.ts";

export function rpcClient() {
  const beacon_ = new LocalBeacon<KnownRpcMethods>({
    path: "./node-template",
    cwd: new URL(".", import.meta.url).pathname,
    dev: true,
  });
  return localClient(beacon_);
}
