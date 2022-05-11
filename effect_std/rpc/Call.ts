import { Effect, MaybeEffect, MaybeEffectList, Resolved } from "/effect/Base.ts";
import * as rpc from "/rpc/mod.ts";
import { RpcClientFactoryRuntime } from "/runtime/RpcClientPool.ts";

export class RpcCall<
  Beacon,
  MethodName extends MaybeEffect<rpc.Name>,
  Params extends MaybeEffectList<rpc.Init<Resolved<MethodName>>["params"]>,
> extends Effect<
  [Beacon, MethodName, ...Params],
  rpc.OkRes<Resolved<MethodName>>,
  never,
  RpcClientFactoryRuntime<Resolved<Beacon>>
> {
  constructor(
    beacon: Beacon,
    methodName: MethodName,
    ...params: Params
  ) {
    super([beacon, methodName, ...params], (beacon, methodName, ...params) => {
      return async (runtime) => {
        const client = await runtime.rpcClientFactory(beacon);
        const result = await rpc.call(client, methodName, params as any as rpc.Init<Resolved<MethodName>>["params"]);
        await client.close();
        return result as rpc.OkRes<Resolved<MethodName>>;
      };
    });
  }
}
