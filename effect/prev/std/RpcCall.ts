import { MaybeEffect, MaybeEffectList, Resolved } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { rpcClient } from "/effect/std/RpcClient.ts";
import * as rpc from "/rpc/mod.ts";

// TODO: why not narrowing result?
export const rpcCall = <
  Beacon,
  MethodName extends MaybeEffect<rpc.Name>,
  // TODO: why do we need `any[]`
  Params extends any[] & MaybeEffectList<rpc.Init<Resolved<MethodName>>["params"]>,
>(
  beacon: Beacon,
  methodName: MethodName,
  params: Params,
) => {
  return native(
    [rpcClient(beacon), methodName, ...params],
    (rpcClient, methodName, ...params) => {
      return () => {
        return rpc.call(rpcClient, methodName, params);
      };
    },
  );
};

// TODO
export class RpcCallError extends Error {}
