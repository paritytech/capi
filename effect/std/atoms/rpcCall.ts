import { effector, EffectorArgs } from "/effect/Effect.ts";
import * as rpc from "/rpc/mod.ts";

// TODO
export class RpcError extends Error {}

export const rpcCall = effector.async.generic(
  "rpcCall",
  (effect) =>
    <N extends rpc.Name, X extends unknown[]>(
      ...args: EffectorArgs<X, [client: rpc.RpcClient, methodName: N, ...params: rpc.Init<N>["params"]]>
    ) =>
      effect(args, () =>
        async (client, methodName, ...params) => {
          const res = await rpc.call(client, methodName, params);
          if (rpc.isErrRes(res)) {
            return new RpcError();
          }
          return res;
        }),
);
