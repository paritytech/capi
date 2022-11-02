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
  CreateListenerCb extends Z.$<U.CreateListener<rpc.NotifMessage>>,
>(
  config: Config,
  methodName: MethodName,
  params: [...Params],
  createListenerCb: CreateListenerCb,
  // TODO: improve cleanup system
  cleanup?: (initOk: rpc.OkMessage) => Z.Effect,
) {
  return Z.call(
    Z.rc(rpcClient(config), methodName, createListenerCb, ...params),
    async function rpcSubscriptionImpl(
      [[client, methodName, createListenerCb, ...params], counter],
    ) {
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
      counter.i--;
      if (counter.i === 0) {
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
  override readonly name = "RpcSubscriptionError";

  constructor(readonly error: rpc.ErrMessage["error"]) {
    super();
  }
}
