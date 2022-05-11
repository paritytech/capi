import { Resolved } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as rpc from "/rpc/mod.ts";

export interface RpcClientR<Beacon> {
  rpcClientFactory: rpc.RpcClientFactory<Beacon>;
}

export const rpcClient = <Beacon>(beacon: Beacon) => {
  return native(
    [beacon],
    (beacon) => {
      return (env: RpcClientR<Resolved<Beacon>>) => {
        return env.rpcClientFactory(beacon);
      };
    },
    () => {
      return () => {
        return (result) => {
          return result.close();
        };
      };
    },
  );
};
