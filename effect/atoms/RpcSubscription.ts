import { Config } from "../../config/mod.ts";
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
  createListener: U.CreateListenerCb<rpc.NotifMessage<Config_, MethodName>>,
) {
  return atom(
    "RpcSubscription",
    [rpcClient(config), methodName, ...params],
    (client, methodName, ...params) => {
      // TODO: cleanup typings
      // TODO: include server err
      return client.subscribe(
        methodName as MethodName,
        params as Parameters<T_<Config_>["RpcSubscriptionMethods"][MethodName]>,
        createListener as any,
      );
    },
  );
}

// TODO: use this
export class RpcSubscriptionError extends U.ErrorCtor("RpcSubscription") {}
