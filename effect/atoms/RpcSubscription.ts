// TODO: finish this

import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcSubscription<
  Methods extends rpc.ProviderMethods,
  MethodName extends Val<rpc.SubscriptionMethodName<Methods>>,
  Params extends ValCollection<Parameters<Methods[U.AssertT<T_<MethodName>, keyof Methods>]>>,
>(
  config: Config<string, Methods>,
  methodName: MethodName,
  params: Params,
  // TODO: decide whether to adapt the inner RPC subscription's api to this design
  createListener: (close: () => void) => rpc.ListenerCb<
    rpc.IngressMessage<Methods, U.AssertT<T_<MethodName>, keyof Methods>>
  >,
) {
  const clientA = rpcClient(config);
  return atom(
    "RpcSubscription",
    [clientA, methodName, ...params],
    async function(client, methodName, ...params) {
      // const ref = this.pin(clientA);
      // const closeContainer: { close?: () => void } = {};
      // await client.subscribe(
      //   methodName as Extract<keyof rpc.NotifByMethodName<Methods>, keyof Methods>,
      //   params as Parameters<Methods[Extract<keyof rpc.NotifByMethodName<Methods>, keyof Methods>]>,
      //   createListener(() => {
      //     closeContainer.close?.();
      //   }) as rpc.ListenerCb<
      //     rpc.NotifMessage<Methods, Extract<keyof rpc.NotifByMethodName<Methods>, keyof Methods>>
      //   >,
      // );
      // if (typeof result !== "function") {
      //   return new RpcError();
      // }
      // closeContainer.close = () => {
      //   result();
      //   ref.unpin();
      // };
      // return;
    },
  );
}

export class RpcSubscriptionError extends U.ErrorCtor("Rpc") {}
