import * as rpc from "../../../rpc/mod.ts";
import { effector, EffectorArgs } from "../../impl/mod.ts";

export interface RpcClientR<Beacon> {
  rpc: rpc.RpcClientFactory<Beacon>;
}

export const rpcClient = effector.async.generic(
  "rpcClient",
  (effect) =>
    <Beacon, X extends unknown[]>(
      ...args: EffectorArgs<X, [factory: rpc.RpcClientFactory<Beacon>, beacon: Beacon]>
    ) => effect(args, () => (factory, beacon) => factory(beacon)),
);

// TODO: cleanup
