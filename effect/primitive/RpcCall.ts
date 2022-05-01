import { _A, AnyEffect, AnyEffectA, AsAnyEffectAList, Effect } from "/effect/Base.ts";
import { RpcClientPoolRuntime, RpcClientPoolRuntimeError } from "/effect/runtime/RpcClientPool.ts";
import * as rpc from "/rpc/mod.ts";
import * as a from "std/async/mod.ts";

export class RpcCall<
  Beacon extends AnyEffect,
  Method extends AnyEffectA<rpc.MethodName>,
  Params extends AsAnyEffectAList<rpc.InitByName[Method[_A]]["params"]>,
> extends Effect<
  RpcClientPoolRuntime<Beacon>,
  RpcClientPoolRuntimeError,
  rpc.ResByName[Method[_A]],
  [Beacon, Method, ...Params]
> {
  constructor(
    beacon: Beacon,
    method: Method,
    ...params: Params
  ) {
    super([beacon, method, ...params], async (runtime, resolvedBeacon, resolvedMethod, ...resolvedParams) => {
      const client = await runtime.rpcClientPool.ref(resolvedBeacon);
      const id = client.uid();
      const init: rpc.Init = {
        jsonrpc: "2.0",
        id,
        method: resolvedMethod,
        params: resolvedParams as any,
      };
      const correspondsToInit = rpc.IsCorrespondingRes(init);
      const pending = a.deferred<rpc.ResByName[Method[_A]]>();
      const derefPending = a.deferred<void>();
      const stopListening = client.listen((res) => {
        if (correspondsToInit(res)) {
          pending.resolve(res as rpc.ResByName[Method[_A]]);
          stopListening();
          client.deref().then(() => {
            derefPending.resolve();
          });
        }
      });
      client.send(init);
      try {
        const result = await pending;
        await derefPending;
        return result;
      } catch (e) {
        return e;
      }
    });
  }
}

export const rpcCall = <
  Beacon extends AnyEffect,
  Method extends AnyEffectA<rpc.MethodName>,
  Params extends AsAnyEffectAList<rpc.InitByName[Method[_A]]["params"]>,
>(
  beacon: Beacon,
  method: Method,
  ...params: Params
): RpcCall<Beacon, Method, Params> => {
  return new RpcCall(beacon, method, ...params);
};
