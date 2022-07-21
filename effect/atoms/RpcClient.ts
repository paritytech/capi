import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import { atom } from "../sys/Atom.ts";

export type RpcClient = ReturnType<typeof rpcClient>;
export function rpcClient<C extends Config<string>>(config: C) {
  return atom("RpcClient", [config], (config) => {
    return rpc.stdClient<Config.GetRpcProviderMethods<C>>(config.discoveryValue);
  }, async (client) => {
    await client.close();
  });
}
