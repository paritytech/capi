// TODO: close connection based on zones rc
import { deferred } from "../deps/std/async.ts";
import * as Z from "../deps/zones.ts";
import { Client, ClientSubscribeContext, ClientSubscribeListener } from "./client.ts";
import { Provider } from "./provider/base.ts";
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts";

export function client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
  provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValue,
) {
  return Z.call(
    Z.ls(provider, discoveryValue),
    ([provider, discoveryValue]) => {
      // FIXME: type casting
      new Client(provider, discoveryValue as Client["discoveryValue"]);
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
      return Z.call(Z.ls(client, method, ...params), ([client, method, ...params]) => {
        return client.call<Result>({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method,
          params,
        });
      });
    };
  };
}

// TODO: utility for less redundant typing of listener
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
      Listener extends Z.$<
        ClientSubscribeListener<
          SendErrorData,
          HandlerErrorData,
          ClientSubscribeContext,
          Z.T<Method>,
          Result
        >
      >,
    >(
      method: Method,
      params: [...Params],
      listener: Listener,
    ) => {
      return Z.call(
        Z.ls(client, method, listener, ...params),
        ([client, method, listener, ...params]) => {
          const pending = deferred<
            ProviderSendError<SendErrorData> | ProviderHandlerError<HandlerErrorData>
          >();
          client.subscribe<Z.T<Method>, Result>(
            {
              jsonrpc: "2.0",
              id: client.providerRef.nextId(),
              method,
              params,
            },
            listener,
            async (subscriptionId) => {
              if (!subscriptionId) {
                pending.resolve();
              }
              const unsubscribeMethod = method.replace("_subscribe", "_unsubscribe");
              const result = await client.call({
                jsonrpc: "2.0",
                id: client.providerRef.nextId(),
                method: unsubscribeMethod,
                params: [subscriptionId],
              });
              pending.resolve(result instanceof Error ? result : undefined);
            },
          );
          return pending;
        },
      );
    };
  };
}
