import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./core/rpcClient.ts";
import { run } from "./run.ts";

export class RpcSubscription<
  Config_ extends Config,
  MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>,
  MethodName_ extends Z.$<MethodName>,
  Params extends Parameters<Config_["RpcSubscriptionMethods"][Z.T<MethodName_>]>,
  Params_ extends Z.Ls$<Params>,
  CreateListenerCb extends Z.$<U.CreateWatchHandler<rpc.NotifMessage<Config_, MethodName>>>,
> extends Z.Name {
  root;

  constructor(
    config: Config_,
    methodName: MethodName_,
    params: [...Params_],
    createListenerCb: CreateListenerCb,
    cleanup?: (initOk: rpc.OkMessage<Config_, MethodName>) => Z.EffectLike,
  ) {
    super();
    this.root = Z.call(
      Z.ls(rpcClient(config), methodName, createListenerCb, ...params),
      async function([client, methodName, createListenerCb, ...params]) {
        const result = await client.subscribe(
          methodName as MethodName,
          params as Parameters<Config_["RpcSubscriptionMethods"][MethodName]>,
          createListenerCb,
          cleanup ? (x) => run(cleanup(x.result), undefined!) : undefined,
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
}

// TODO: handle elsewhere
export class RpcSubscriptionError<Config_ extends Config> extends U.ErrorCtor("RpcSubscription") {
  constructor(readonly error: rpc.ErrMessage<Config_>["error"]) {
    super();
  }
}
