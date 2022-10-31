import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./core/rpcClient.ts";

export function rpcCall<MethodName extends Z.$<string>, Params extends Z.Ls$<unknown[]>>(
  config: Config,
  methodName: MethodName,
  params: [...Params],
) {
  const client = rpcClient(config);
  const deps = Z.ls(client, methodName, ...params);
  return Z.call(
    Z.ls(deps, Z.rc(client, deps)),
    async function rpcCallImpl([[client, methodName, ...params], rc]) {
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
      if (rc() == 1) {
        const close = await client.close();
        if (close instanceof Error) return close;
      }
      // TODO: should this effect implicitly index into `result`?
      return result;
    },
  );
}
