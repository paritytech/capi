import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import { atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcCall<
  Methods extends rpc.ProviderMethods,
  MethodName extends Val<Extract<keyof Methods, string>>,
  Params extends ValCollection<Parameters<Methods[T_<MethodName>]>>,
>(
  config: Config<string, Methods>,
  methodName: MethodName,
  params: Params,
) {
  return atom(
    "RpcCall",
    [rpcClient(config), methodName, ...params],
    async (client, methodName, ...params) => {
      // TODO: clean up typings
      const result = await client.call(
        methodName,
        params as Parameters<(Methods & rpc.ProviderMethods)[T_<MethodName>]>,
      );
      if (result.error) {
        return new RpcError({
          ...result.error,
          attempt: {
            methodName,
            params,
          },
        });
      }
      return result;
    },
  );
}
