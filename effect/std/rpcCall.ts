import * as rpc from "../../rpc/mod.ts";
import { ErrorCtor } from "../../util/mod.ts";
import { AnyMethods } from "../../util/mod.ts";
import { effector, EffectorArgs } from "../impl/mod.ts";

export class RpcServerInternalError extends ErrorCtor("RpcServerInternal") {
  constructor(readonly inner: rpc.ErrMessage) {
    super();
  }
}

export const rpcCall = effector.async.generic(
  "rpcCall",
  (effect) =>
    <N extends AnyMethods, X extends unknown[]>(
      ...args: EffectorArgs<
        X,
        [
          client: rpc.AnyClient,
          methodName: Extract<keyof N, string>,
          ...params: rpc.InitMessage<N>["params"],
        ]
      >
    ) =>
      effect(args, () =>
        async (client, methodName, ...params) => {
          const result = await client.call(methodName, params);
          if (result.error) {
            return new RpcServerInternalError(result);
          }
          return result;
        }),
);
