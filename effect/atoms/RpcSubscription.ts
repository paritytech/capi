import { Config } from "../../config/mod.ts";
import { unreachable } from "../../deps/std/testing/asserts.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcSubscription<
  Config_ extends Config,
  MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>,
  MethodName_ extends Val<MethodName>,
  Params extends Parameters<Config_["RpcSubscriptionMethods"][T_<MethodName_>]>,
  Params_ extends ValCollection<Params>,
>(
  config: Config_,
  methodName: MethodName_,
  params: Params_,
  createListener: U.CreateWatchHandler<rpc.NotifMessage<Config_, MethodName>>,
) {
  return atom(
    "RpcSubscription",
    [rpcClient(config), methodName, ...params],
    async (client, methodName, ...params) => {
      const result = await client.subscribe(
        methodName as MethodName,
        params as Parameters<T_<Config_>["RpcSubscriptionMethods"][MethodName]>,
        createListener as any,
      );
      if (result?.error) {
        return new RpcSubscriptionError(result);
      }
      return unreachable();
    },
  );
}

export class RpcSubscriptionError<Config_ extends Config> extends U.ErrorCtor("RpcSubscription") {
  constructor(readonly error: rpc.ErrMessage<Config_>) {
    super();
  }
}
