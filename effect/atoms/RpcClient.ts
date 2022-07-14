import { Config } from "../../Config.ts";
import * as rpc from "../../rpc/mod.ts";
import { atom } from "../sys/Atom.ts";

export type rpcClient = typeof rpcClient;
export function rpcClient<C extends Config<string>>(config: C) {
  return atom("RpcClient", [config], (config) => {
    return rpc.stdClient<Config.M_<C>>(config.discoveryValue);
  }, async (client) => {
    await client.close();
  });
}
