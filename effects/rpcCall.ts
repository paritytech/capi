import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./core/rpcClient.ts";

export function rpcCall<MethodName extends Z.$<string>, Params extends Z.Ls$<unknown[]>>(
  config: Config,
  methodName: MethodName,
  params: [...Params],
) {
  return Z.call(
    Z.rc(rpcClient(config), methodName, ...params),
    async function rpcCallImpl([[client, methodName, ...params], counter]) {
      const result = await client.call(
        methodName,
        params,
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
      counter.i--;
      if (counter.i === 1) {
        const close = await client.close();
        if (close instanceof Error) return close;
      }
      // TODO: should this effect implicitly index into `result`?
      return result;
    },
  );
}
