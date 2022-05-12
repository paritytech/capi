import { HOEffect, MaybeEffectLike, MaybeEffectLikeList, Resolved } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { rpcClient } from "/effect/std/atoms/rpcClient.ts";
import * as rpc from "/rpc/mod.ts";

// TODO
export class RpcError extends Error {}

export class RpcCall<
  Beacon,
  MethodName extends MaybeEffectLike<rpc.Name>,
  // TODO: fix the need for `any[]`
  Params extends any[] & MaybeEffectLikeList<rpc.Init<Resolved<MethodName>>["params"]>,
> extends HOEffect {
  params;
  root;

  constructor(
    readonly beacon: Beacon,
    readonly methodName: MethodName,
    ...params: Params
  ) {
    super();
    this.params = params;
    const rpcClient_ = rpcClient(beacon);
    const args: [typeof rpcClient_, MethodName, ...Params] = [rpcClient_, methodName, ...params];
    this.root = native(
      args,
      (client, methodName, ...params) => {
        return async () => {
          // TODO: fix param type resolution issue
          const res = await rpc.call(client, methodName, params as any);
          if (rpc.isErrRes(res)) {
            return new RpcError();
          }
          return res;
        };
      },
    );
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
  return new RpcCall(beacon, methodName, ...params);
};
