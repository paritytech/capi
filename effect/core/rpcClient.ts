import { Config } from "../../config/mod.ts";
import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";

export function rpcClient<C extends Config>(config: C) {
  return Z.call(config, function rpcClientImpl() {
    return rpc.stdClient(config);
  });
}
