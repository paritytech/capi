import { Config } from "../../Config.ts";
import * as rpc from "../../rpc/mod.ts";
import { atom, Val, ValCollection } from "../sys/mod.ts";
import { rpcClient } from "./RpcClient.ts";

type MethodName<C extends Config> = Extract<keyof Config.M_<C>, string>;
type MethodArgs<C extends Config, Name extends MethodName<C>> = rpc.InitMessage<
  Config.M_<C>,
  Name
>["params"];

export type rpcCall = typeof rpcCall;
export function rpcCall<
  C extends Config,
  MethodNameResolved extends MethodName<C>,
  MethodName_ extends Val<MethodNameResolved>,
  // TODO: get rid of `any[]`
  MethodArgs_ extends any[] & ValCollection<MethodArgs<C, MethodNameResolved>>,
>(config: C, methodName: MethodName_, ...args: MethodArgs_) {
  return atom(
    "RpcCall",
    [rpcClient(config), methodName, ...args],
    async (client, methodName, ...args) => {
      // client.call(methodName, args);
    },
  );
}
