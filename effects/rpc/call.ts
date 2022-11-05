import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";
import { discardCheck, RpcServerError } from "./common.ts";

export function call<Params extends unknown[], Result>(method: string) {
  return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
    return <Params_ extends Z.Ls$<Params>>(...params: [...Params_]) => {
      return Z.call(
        Z.rc(client, method, ...params),
        async function rpcCallImpl([[client, method, ...params], counter]) {
          type ClientE = typeof client[rpc.ClientE_];
          // TODO: why do we need to explicitly type this / why is this not being inferred?
          const id = client.providerRef.nextId();
          const result: rpc.ClientCallEvent<ClientE["send"], ClientE["handler"], Result> =
            await client.call<Result>({
              jsonrpc: "2.0",
              id,
              method,
              params,
            });
          const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
          if (discardCheckResult) return discardCheckResult;
          if (result instanceof Error) {
            return result;
          } else if (result.error) {
            return new RpcServerError(result);
          }
          return result.result;
        },
      ).zoned("RpcClient");
    };
  };
}
