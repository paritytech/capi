import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { AnyAtom, atom } from "../sys/Atom.ts";
import { T_, Val, ValCollection } from "../sys/Effect.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./RpcClient.ts";

export function rpcSubscription<
  Config_ extends Config,
  MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>,
  MethodName_ extends Val<MethodName>,
  Params extends Parameters<Config_["RpcSubscriptionMethods"][T_<MethodName_>]>,
  Params_ extends ValCollection<Params>,
>(
  config: Config_,
  methodName: MethodName_,
  params: Params_,
  createListener: U.CreateWatchHandler<rpc.NotifMessage<Config_, MethodName>>,
  cleanup?: (initOk: rpc.OkMessage<Config_, MethodName>) => AnyAtom,
) {
  return atom(
    "RpcSubscription",
    [rpcClient(config), methodName, ...params],
    async function(client, methodName, ...params) {
      const result = await client.subscribe(
        methodName as MethodName,
        params as Parameters<T_<Config_>["RpcSubscriptionMethods"][MethodName]>,
        createListener,
        cleanup
          ? (x) => {
            return this.run(cleanup(x.result));
          }
          : undefined,
      );
      if (result?.error) {
        return new RpcError({
          ...result.error,
          attempt: {
            methodName,
            params,
          },
        });
      }
      // TODO: clean up typings –– should implicitly narrow to `undefined`
      return result as undefined;
    },
  );
}

export class RpcSubscriptionError<Config_ extends Config> extends U.ErrorCtor("RpcSubscription") {
  constructor(readonly error: rpc.ErrMessage<Config_>["error"]) {
    super();
  }
}
