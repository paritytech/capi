// TODO: close connection based on zones rc
import * as Z from "../deps/zones.ts";
import { Client, ClientSubscribeContext } from "./client.ts";
import * as msg from "./messages.ts";
import { Provider } from "./provider/base.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./provider/errors.ts";
import * as U from "./util.ts";

export function client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
  provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValue,
) {
  return Z.call(
    Z.ls(provider, discoveryValue),
    () => {
      return new Client(provider, discoveryValue);
    },
  );
}

// TODO: not narrowing error inner data type
export function call<Client_ extends Z.$<Client>>(client: Client_) {
  return <Result>() => {
    return <Method extends Z.$<string>, Params extends unknown[]>(
      method: Method,
      params: [...Params],
    ) => {
      return Z.call(Z.ls(client, method, ...params), async ([client, method, ...params]) => {
        const result = await client.call<Result>({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method,
          params,
        });
        if (result instanceof Error) {
          return result;
        } else if (result.error) {
          return new RpcServerError(result);
        }
        return result.result;
      });
    };
  };
}

export function subscription<
  SendErrorData,
  HandlerErrorData,
  CloseErrorData,
  Client_ extends Z.$<Client<any, SendErrorData, HandlerErrorData, CloseErrorData>>,
>(client: Client_) {
  return <Result>() => {
    return <
      Method extends Z.$<string>,
      Params extends unknown[],
      Listener extends Z.$<U.Listener<Result, ClientSubscribeContext>>,
    >(
      method: Method,
      params: [...Params],
      listener: Listener,
    ) => {
      return Z.call(
        Z.ls(client, method, listener, ...params),
        async ([client, method, listener, ...params]) => {
          let error:
            | undefined
            | RpcServerError
            | ProviderSendError<SendErrorData>
            | ProviderHandlerError<HandlerErrorData>
            | ProviderCloseError<CloseErrorData>;
          const id = await client.subscribe<Z.T<Method>, Result>({
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
          return error || id!;
        },
      );
    };
  };
}

export class RpcServerError extends Error {
  override readonly name = "RpcServer";

  constructor(readonly inner: msg.ErrorMessage) {
    super();
  }
}

// const c = client(proxyProvider, "" as string);

// export function subscribeNewHeads<Handler extends Z.$<RpcHandlerUtil<typeof c, string>>>(
//   handler: Handler,
// ) {
//   const subscribeNewHeads = subscription(c as any)<string>()(
//     "chain_subscribeNewHeads",
//     [],
//     handler,
//   );
//   return call(c as any)<void>()("chain_unsubscribeNewHeads", [
//     subscribeNewHeads,
//   ]);
// }

// const $sub = rpcSubscription("subscribeSomeMethod", [], function(e) {
//   console.log(e);
//   if (someCondition) {
//     this.stop();
//   }
// });
// const $unsub = rpcCall("unsubscribeSomeMethod", [$sub]);
