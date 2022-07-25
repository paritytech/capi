import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcSubscription<
  Methods extends rpc.ProviderMethods,
  MethodName extends Val<keyof rpc.NotifByMethodName<Methods>>,
  Params extends ValCollection<Parameters<Methods[U.AssertT<T_<MethodName>, keyof Methods>]>>,
>(
  config: Config<string, Methods>,
  methodName: MethodName,
  params: Params,
  // TODO: decide whether to adapt the inner RPC subscription's api to this design
  createListener: rpc.CreateListenerCb<
    rpc.IngressMessage<Methods, U.AssertT<T_<MethodName>, keyof Methods>>
  >,
) {
  const clientA = rpcClient(config);
  return atom(
    "RpcSubscription",
    [clientA, methodName, ...params],
    (client, methodName, ...params) => {
      // TODO: cleanup typings
      return client.subscribe(
        methodName as any,
        params as any,
        createListener as any,
      );
    },
  );
}

export class RpcSubscriptionError extends U.ErrorCtor("Rpc") {}
