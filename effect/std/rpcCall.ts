import { Container, MaybeEffectLike, MaybeEffectLikeList, Resolved } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { rpcClient } from "/effect/std/atoms/rpcClient.ts";
import * as rpc from "/rpc/mod.ts";

export const _rpcCall = <
  Beacon,
  MethodName extends MaybeEffectLike<rpc.Name>,
  // TODO: fix the need for `any[]`
  Params extends any[] & MaybeEffectLikeList<rpc.Init<Resolved<MethodName>>["params"]>,
>(
  beacon: Beacon,
  methodName: MethodName,
  ...params: Params
) => {
  return native(
    [rpcClient(beacon), methodName, ...params],
    (client, methodName, ...params) => {
      return async () => {
        // TODO: fix typing here
        return rpc.call(client as any, methodName as any, params);
      };
    },
  );
};

export class RpcCall<
  Beacon,
  MethodName extends MaybeEffectLike<rpc.Name>,
  // TODO: fix the need for `any[]`
  Params extends any[] & MaybeEffectLikeList<rpc.Init<Resolved<MethodName>>["params"]>,
> extends Container {
  params;
  inner;

  constructor(
    readonly beacon: Beacon,
    readonly methodName: MethodName,
    ...params: Params
  ) {
    super();
    this.params = params;
    this.inner = _rpcCall(beacon, methodName, ...params);
  }
}

export const rpcCall = <
  Beacon,
  MethodName extends MaybeEffectLike<rpc.Name>,
  // TODO: fix the need for `any[]`
  Params extends any[] & MaybeEffectLikeList<rpc.Init<Resolved<MethodName>>["params"]>,
>(
  beacon: Beacon,
  methodName: MethodName,
  ...params: Params
): RpcCall<Beacon, MethodName, Params> => {
  // TODO: why the error on `params`
  return new RpcCall(beacon, methodName, ...params as any);
};
