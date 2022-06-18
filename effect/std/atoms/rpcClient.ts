import * as rpc from "../../../rpc/mod.ts";
import { effector, EffectorArgs } from "../../impl/mod.ts";

export interface RpcClientR<Beacon> {
  rpc: (beacon: Beacon) => rpc.RpcClient<rpc.RpcError>;
}

export const rpcClient = effector.async.generic(
  "rpcClient",
  (effect) =>
    <Beacon, X extends unknown[]>(
      ...args: EffectorArgs<
        X,
        [factory: (beacon: Beacon) => rpc.RpcClient<rpc.RpcError>, beacon: Beacon]
      >
    ) =>
      effect(args, () =>
        async (factory, beacon) => {
          return factory(beacon);
        }),
);

// TODO: cleanup
