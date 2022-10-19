import { Config } from "../../config/mod.ts";
import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";

export function rpcClient<C extends Config<string>>(config: C) {
  return Z.call(config, (config) => {
    return rpc.stdClient(config);
  });
}

// TODO:
/**
(client) => {
  return client instanceof Error ? undefined : client.close();
}
*/
