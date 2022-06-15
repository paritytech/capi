import * as rpc from "../../rpc/mod.ts";
import { effector, EffectorArgs } from "../impl/mod.ts";

export const rpcCall = effector.async.generic(
  "rpcCall",
  (effect) =>
    <N extends rpc.MethodName, X extends unknown[]>(
      ...args: EffectorArgs<
        X,
        [
          client: rpc.RpcClient<rpc.RpcError>,
          methodName: N,
          ...params: rpc.InitMessage<N>["params"],
        ]
      >
    ) =>
      effect(args, () =>
        async (client, methodName, ...params) => {
          return await client.call(methodName, params);
        }),
);
