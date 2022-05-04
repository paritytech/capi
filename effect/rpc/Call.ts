import { _A, AnyEffect, AnyEffectA, AsAnyEffectAList, Effect } from "/effect/Base.ts";
import { RpcClientFactoryRuntime, RpcClientFactoryRuntimeError } from "/effect/runtime/RpcClientPool.ts";
import * as rpc from "/rpc/mod.ts";

export class RpcCall<
  Beacon extends AnyEffect,
  Method extends AnyEffectA<rpc.Name>,
  Params extends AsAnyEffectAList<rpc.Init<Method[_A]>["params"]>,
> extends Effect<
  RpcClientFactoryRuntime<Beacon[_A]>,
  RpcClientFactoryRuntimeError,
  rpc.OkRes<Method[_A]>,
  [Beacon, Method, ...Params]
> {
  constructor(
    beacon: Beacon,
    method: Method,
    ...params: Params
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
  Beacon extends AnyEffect,
  Method extends AnyEffectA<rpc.Name>,
  Params extends AsAnyEffectAList<rpc.Init<Method[_A]>["params"]>,
>(
  beacon: Beacon,
  method: Method,
  ...params: Params
): RpcCall<Beacon, Method, Params> => {
  return new RpcCall(beacon, method, ...params);
};
