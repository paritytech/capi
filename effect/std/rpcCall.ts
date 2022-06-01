import { effector, EffectorArgs } from "/effect/Effect.ts";
import * as rpc from "/rpc/mod.ts";

// TODO
export class RpcError extends Error {
  constructor(readonly inner: rpc.ErrMessage) {
    super();
  }
}

export const rpcCall = effector.async.generic(
  "rpcCall",
  (effect) =>
    <N extends rpc.MethodName, X extends unknown[]>(
      ...args: EffectorArgs<X, [client: rpc.RpcClient, methodName: N, ...params: rpc.InitMessage<N>["params"]]>
    ) =>
      effect(args, () =>
        async (client, methodName, ...params) => {
          const res = await rpc.call(client, methodName, params);
          if (res?.error) {
            return new RpcError(res);
          }
          return res;
        }),
);
