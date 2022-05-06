import { _A, AnyResolvable, AnyResolvableA, Effect, MaybeUnresolved, Resolved } from "/effect/Base.ts";
import { RpcClientFactoryRuntime, RpcClientFactoryRuntimeError } from "/effect/runtime/RpcClientPool.ts";
import * as rpc from "/rpc/mod.ts";

export class RpcCall<
  Beacon extends AnyResolvable,
  Method extends AnyResolvableA<rpc.Name>,
  Params extends MaybeUnresolved<rpc.Init<Resolved<Method>>["params"]>,
> extends Effect<
  RpcClientFactoryRuntime<Resolved<Beacon>>,
  RpcClientFactoryRuntimeError,
  rpc.OkRes<Resolved<Method>>,
  [Beacon, Method, ...Params]
> {
  constructor(
    beacon: Beacon,
    method: Method,
    params: Params,
  ) {
    super([beacon, method, ...params], async (runtime, beacon, method, ...params) => {
      const client = await runtime.rpcClientFactory(beacon);
      // TODO: fix this typing
      const result = await rpc.call(client, method, params as any) as any;
      await client.close();
      return result;
    });
  }
}

export const rpcCall = <
  Beacon extends AnyResolvable,
  Method extends AnyResolvableA<rpc.Name>,
  Params extends MaybeUnresolved<rpc.Init<Resolved<Method>>["params"]>,
>(
  beacon: Beacon,
  method: Method,
  ...params: Params
): RpcCall<Beacon, Method, Params> => {
  return new RpcCall(beacon, method, params);
};
