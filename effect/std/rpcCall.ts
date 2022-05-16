import { HOEffect, MaybeEffectLike, UnwrapA, WrapAll } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { rpcClient } from "/effect/std/atoms/rpcClient.ts";
import * as rpc from "/rpc/mod.ts";

// TODO
export class RpcError extends Error {}

export class RpcCall<
  Beacon,
  MethodName extends MaybeEffectLike<rpc.Name>,
  // TODO: fix the need for `any[]`
  Params extends any[] & WrapAll<rpc.Init<UnwrapA<MethodName>>["params"]>,
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
    this.root = step(
      [rpcClient_, methodName, ...params],
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
  Params extends any[] & WrapAll<rpc.Init<UnwrapA<MethodName>>["params"]>,
>(
  beacon: Beacon,
  methodName: MethodName,
  ...params: Params
): RpcCall<Beacon, MethodName, Params> => {
  // TODO: why the error on `params`
  return new RpcCall(beacon, methodName, ...params);
};
