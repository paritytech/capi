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
    const client = rpcClient(config);
    const deps = Z.ls(client, methodName, createListenerCb, ...params);
    this.root = Z.call(
      Z.ls(deps, Z.rc(client, deps)),
      async function([[client, methodName, createListenerCb, ...params], rc]) {
        const result = await client.subscribe(
          methodName as MethodName,
          params as Parameters<Config_["RpcSubscriptionMethods"][MethodName]>,
          createListenerCb as any,
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
        if (rc() == 1) {
          const close = await client.close();
          if (close instanceof Error) return close;
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
