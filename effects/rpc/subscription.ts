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
          async ([[client, listener, ...params], counter]) => {
            // console.log({ method, params, counter });
            type ClientE = typeof client[rpc.ClientE_];
            let error:
              | undefined
              | RpcServerError
              | rpc.ProviderSendError<ClientE["send"]>
              | rpc.ProviderHandlerError<ClientE["handler"]>;
            const id = await client.subscribe<Method, Result>({
              jsonrpc: "2.0",
              id: client.providerRef.nextId(),
              method,
              params,
            }, function(e) {
              if (e instanceof Error) {
                error = e;
                this.stop();
              } else if (e.error) {
                error = new RpcServerError(e);
                this.stop();
              } else {
                listener.apply(this, [e.params.result]);
              }
            });
            const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
            // console.log({ method, params, result: error || id, counter });
            return discardCheckResult || error || id!;
          },
        );
      };
    };
  };
}
