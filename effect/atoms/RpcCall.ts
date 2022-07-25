import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcCall<
  Methods extends rpc.ProviderMethods,
  MethodName extends Extract<keyof Methods, string>,
  MethodName_ extends Val<MethodName>,
  Params extends ValCollection<Parameters<Methods[T_<MethodName>]>>,
>(
  config: Config<string, Methods>,
  methodName: MethodName_,
  params: Params,
) {
  return atom(
    "RpcCall",
    [rpcClient(config), methodName, ...params],
    async (client, methodName, ...params) => {
      // TODO: clean up typings
      const result = await client.call(
        methodName as MethodName,
        params as Parameters<Methods[MethodName]>,
      );
      if (result.error) {
        // TODO: include server err
        return new RpcCallError();
      }
      return result;
    },
  );
}

export class RpcCallError extends U.ErrorCtor("RpcCallError") {}
