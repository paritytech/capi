import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { rpcClient } from "./RpcClient.ts";

export type RpcCall = ReturnType<typeof rpcCall>;
export function rpcCall<
  Methods extends rpc.ProviderMethods,
  MethodName extends Val<U.AssertT<keyof Methods, string>>,
  Params extends ValCollection<Parameters<Methods[T_<MethodName>]>>,
>(
  config: Config<string, Methods>,
  methodName: MethodName,
  ...params: Params
) {
  return atom(
    "RpcCall",
    [rpcClient(config), methodName, ...params],
    async (client, methodName, ...params) => {
      const result = await client.call(methodName, params as Parameters<Methods[T_<MethodName>]>);
      if (result.error) {
        return new RpcError();
      }
      return result;
    },
  );
}

class RpcError extends U.ErrorCtor("Rpc") {}
