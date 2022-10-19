import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./core/rpcClient.ts";

export class RpcCall<
  Methods extends rpc.ProviderMethods,
  MethodName extends Z.$<Extract<keyof Methods, string>>,
  Params extends Z.Ls$<Parameters<Methods[Z.T<MethodName>]>>,
> extends Z.Name {
  root;

  constructor(
    config: Config<string, Methods>,
    methodName: MethodName,
    params: [...Params],
  ) {
    super();
    this.root = Z.call(
      Z.ls(rpcClient(config), methodName, ...params),
      async ([client, methodName, ...params]) => {
        // TODO: clean up typings
        const result = await client.call(
          methodName,
          params as Parameters<(Methods & rpc.ProviderMethods)[Z.T<MethodName>]>,
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
        // TODO: should this effect implicitly index into `result`?
        return result;
      },
    );
  }
}
