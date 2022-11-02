import { Config } from "../config/mod.ts";
import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { RpcError } from "./common.ts";
import { rpcClient } from "./core/rpcClient.ts";
import { run } from "./run.ts";

export function rpcSubscription<
  MethodName extends Z.$<string>,
  Params extends Z.Ls$<unknown[]>,
  CreateListenerCb extends Z.$<U.CreateWatchHandler<rpc.NotifMessage>>,
>(
  config: Config,
  methodName: MethodName,
  params: [...Params],
  createListenerCb: CreateListenerCb,
  // TODO: improve cleanup system
  cleanup?: (initOk: rpc.OkMessage) => Z.Effect,
) {
  const client = rpcClient(config);
  const deps = Z.ls(client, methodName, createListenerCb, ...params);
  return Z.call(
    Z.ls(deps, Z.rc(client, deps)),
    async function rpcSubscriptionImpl([[client, methodName, createListenerCb, ...params], rc]) {
      const result = await client.subscribe(
        methodName,
        params,
        createListenerCb,
        cleanup ? (x) => run(cleanup(x), undefined!) : undefined,
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

// TODO: handle elsewhere
export class RpcSubscriptionError extends Error {
  override readonly name = "RpcSubscription";
  constructor(readonly error: rpc.ErrMessage["error"]) {
    super();
  }
}
