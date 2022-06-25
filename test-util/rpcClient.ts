import { KnownRpcMethods } from "../known/mod.ts";
import { localClient } from "../rpc/mod.ts";

export function rpcClient() {
  return localClient<KnownRpcMethods>({
    path: "./node-template",
    cwd: new URL(".", import.meta.url).pathname,
    dev: true,
  });
}
