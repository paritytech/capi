import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";
import { discardCheck, RpcServerError } from "./common.ts";

// TODO: why are leading type params unknown when `extends Z.$Client<any, SendErrorData, HandlerErrorData, CloseErrorData>`?
export function subscription<Params extends unknown[], Result>() {
  return <Method extends string>(method: Method) => {
    return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
      return <
        Params_ extends Z.Ls$<Params>,
        Listener extends Z.$<U.Listener<Result, rpc.ClientSubscribeContext>>,
      >(params: [...Params_], listener: Listener) => {
        return Z.call(
          Z.rc(client, listener, ...params),
          async function rpcSubscriptionImpl([[client, listener, ...params], counter]) {
            type ClientE = typeof client[rpc.ClientE_];
            const id = client.providerRef.nextId();
            let error:
              | undefined
              | RpcServerError
              | rpc.ProviderSendError<ClientE["send"]>
              | rpc.ProviderHandlerError<ClientE["handler"]>;
            const subscriptionId = await client.subscribe<Method, Result>({
              jsonrpc: "2.0",
              id,
              method,
              params,
            }, function(e) {
              if (e instanceof Error) {
                error = e;
                this.stop();
              } else if (e.error) {
                error = new RpcServerError(e);
                console.log(e);
                this.stop();
              } else {
                listener.apply(this, [e.params.result]);
              }
            });
            const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
            return discardCheckResult || error || subscriptionId!;
          },
        ).zoned("RpcSubscription");
      };
    };
  };
}
